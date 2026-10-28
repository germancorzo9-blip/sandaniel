// POST /api/pedido  { items: [{ sku: "MED-001", cantidad: 2 }, ...] }
// Lowers the stock in data/inventario.csv and logs the order in data/pedidos.csv.
const { registrarPedido } = require('./_lib/inventario');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Usa POST para enviar un pedido.' });
  }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  try {
    const r = await registrarPedido(body && body.items);
    return res.status(201).json(r);
  } catch (e) {
    if (e.faltantes) return res.status(409).json({ error: 'No hay stock suficiente para algunos productos.', faltantes: e.faltantes });
    if (e.status && e.status < 500 && !e.github) return res.status(e.status).json({ error: e.message });
    console.error(e);
    // the GitHub status and message help the pharmacy fix the setup; they never include the token
    return res.status(e.status === 503 ? 503 : 502).json({ error: 'No pudimos registrar el pedido en el inventario. Intenta de nuevo en unos segundos.', detalle: e.github ? e.message : undefined });
  }
};
