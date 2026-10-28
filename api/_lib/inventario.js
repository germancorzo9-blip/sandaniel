// Inventory stored as data/inventario.csv in GitHub. Every order is one commit that
// lowers the stock and appends the lines to data/pedidos.csv.
const OWNER = process.env.GITHUB_OWNER || 'germancorzo9-blip';
const REPO = process.env.GITHUB_REPO || 'sandaniel';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const API = process.env.GITHUB_API || 'https://api.github.com';
const INV = 'data/inventario.csv';
const LOG = 'data/pedidos.csv';
const LOG_HEADER = ['pedido', 'fecha', 'sku', 'nombre', 'cantidad', 'precio_unitario', 'subtotal', 'stock_anterior', 'stock_nuevo'];
const MAX_POR_PRODUCTO = 10;
const MAX_LINEAS = 30;

// CSV with minimal quoting, keeping the file's own line ending
function parseCSV(text) {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || (c === '\r' && text[i + 1] === '\n')) {
      if (c === '\r') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return { rows, eol };
}
const quote = v => /[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
const toCSV = ({ rows, eol }) => rows.map(r => r.map(quote).join(',')).join(eol) + eol;

async function gh(path, opts = {}) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw Object.assign(new Error('Falta GITHUB_TOKEN en las variables de entorno de Vercel.'), { status: 503 });
  const res = await fetch(`${API}/repos/${OWNER}/${REPO}${path}`, {
    ...opts,
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'farmacia-san-daniel', ...(opts.body ? { 'Content-Type': 'application/json' } : {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const need = res.headers.get('x-accepted-github-permissions');
    throw Object.assign(new Error(`GitHub ${res.status}: ${data && data.message}${need ? ` (permiso requerido: ${need})` : ''}`), { status: res.status, github: true });
  }
  return data;
}
// What the configured token can do on this repository, to explain a 403 without exposing the token
async function accesoToken() {
  try {
    const r = await gh('');
    return r.permissions ? (r.permissions.push ? 'el token puede escribir en el repositorio' : 'el token solo puede leer el repositorio') : 'GitHub no informó los permisos del token';
  } catch (e) { return e.message; }
}
async function readFile(path, ref) {
  try {
    const f = await gh(`/contents/${path}?ref=${ref}`);
    return Buffer.from(f.content, 'base64').toString('utf8');
  } catch (e) {
    if (e.status === 404) return null;
    throw e;
  }
}
async function head() {
  const ref = await gh(`/git/ref/heads/${BRANCH}`);
  return ref.object.sha;
}

function table(text) {
  const csv = parseCSV(text);
  const h = csv.rows[0], col = name => h.indexOf(name);
  return { csv, col, rows: csv.rows.slice(1).filter(r => r.length === h.length) };
}

async function stockActual() {
  const sha = await head();
  const { rows, col } = table(await readFile(INV, sha));
  const stock = {};
  for (const r of rows) stock[r[col('sku')]] = Number(r[col('stock')]) || 0;
  return { stock, version: sha };
}

class StockError extends Error {
  constructor(faltantes) { super('Stock insuficiente'); this.status = 409; this.faltantes = faltantes; }
}

// Validates, lowers the stock and commits. Retries when another order landed first.
async function registrarPedido(items, { intentos = 8 } = {}) {
  if (!Array.isArray(items) || !items.length) throw Object.assign(new Error('El pedido no tiene productos.'), { status: 400 });
  if (items.length > MAX_LINEAS) throw Object.assign(new Error(`Un pedido puede tener hasta ${MAX_LINEAS} productos distintos.`), { status: 400 });
  const pedidoQty = {};
  for (const it of items) {
    const sku = String(it && it.sku || '').trim().toUpperCase(), q = Number(it && it.cantidad);
    if (!sku || !Number.isInteger(q) || q < 1) throw Object.assign(new Error('Cantidad inválida en el pedido.'), { status: 400 });
    pedidoQty[sku] = (pedidoQty[sku] || 0) + q;
  }
  for (const [sku, q] of Object.entries(pedidoQty))
    if (q > MAX_POR_PRODUCTO) throw Object.assign(new Error(`Puedes llevar hasta ${MAX_POR_PRODUCTO} unidades de ${sku} por pedido.`), { status: 400 });

  for (let intento = 1; ; intento++) {
    const base = await head();
    const commit = await gh(`/git/commits/${base}`);
    const { csv, col, rows } = table(await readFile(INV, base));
    const bySku = Object.fromEntries(rows.map(r => [r[col('sku')], r]));

    const faltantes = [], lineas = [];
    for (const [sku, q] of Object.entries(pedidoQty)) {
      const r = bySku[sku];
      if (!r || r[col('activo')] !== '1') { faltantes.push({ sku, pedido: q, disponible: 0, motivo: 'no disponible' }); continue; }
      const stock = Number(r[col('stock')]) || 0;
      if (stock < q) { faltantes.push({ sku, nombre: r[col('nombre')], pedido: q, disponible: stock }); continue; }
      lineas.push({ sku, nombre: r[col('nombre')], cantidad: q, precio: Number(r[col('precio_clp')]), antes: stock, despues: stock - q, minimo: Number(r[col('stock_minimo')]) || 0, row: r });
    }
    if (faltantes.length) throw new StockError(faltantes);

    for (const l of lineas) l.row[col('stock')] = String(l.despues);
    const ahora = new Date();
    const id = 'SD-' + ahora.toISOString().slice(2, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    const fecha = ahora.toISOString().replace(/\.\d+Z$/, 'Z');

    const logText = await readFile(LOG, base);
    const log = logText ? parseCSV(logText) : { rows: [LOG_HEADER], eol: csv.eol };
    for (const l of lineas) log.rows.push([id, fecha, l.sku, l.nombre, String(l.cantidad), String(l.precio), String(l.precio * l.cantidad), String(l.antes), String(l.despues)]);

    const tree = await gh('/git/trees', { method: 'POST', body: { base_tree: commit.tree.sha, tree: [
      { path: INV, mode: '100644', type: 'blob', content: toCSV(csv) },
      { path: LOG, mode: '100644', type: 'blob', content: toCSV(log) },
    ] } });
    const resumen = lineas.map(l => `${l.sku} x${l.cantidad}`).join(', ');
    const nuevo = await gh('/git/commits', { method: 'POST', body: { message: `Pedido ${id}: ${resumen}`, tree: tree.sha, parents: [base] } });
    try {
      await gh(`/git/refs/heads/${BRANCH}`, { method: 'PATCH', body: { sha: nuevo.sha, force: false } });
    } catch (e) {
      // another order or edit moved the branch first: read again and retry
      if ((e.status === 422 || e.status === 409) && intento < intentos) {
        await new Promise(r => setTimeout(r, 100 + Math.random() * 300 * intento));
        continue;
      }
      throw e;
    }
    const total = lineas.reduce((s, l) => s + l.precio * l.cantidad, 0);
    return {
      pedido: id, fecha, total, commit: nuevo.sha,
      items: lineas.map(({ sku, nombre, cantidad, precio, despues, minimo }) => ({ sku, nombre, cantidad, precio, subtotal: precio * cantidad, stock: despues, stockBajo: despues <= minimo })),
    };
  }
}

module.exports = { parseCSV, toCSV, stockActual, registrarPedido, StockError, accesoToken };
