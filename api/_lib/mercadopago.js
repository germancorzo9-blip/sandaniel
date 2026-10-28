// Mercado Pago Checkout Pro: one payment preference per reserved order, and the
// payment status read back from Mercado Pago when it notifies /api/mercadopago.
const crypto = require('crypto');

const MP = process.env.MP_API || 'https://api.mercadopago.com';
// Same rule as the cart in src.html: free delivery from $29.990, otherwise $2.990
const FREE = 29990, SHIP = 2990;

const activo = () => !!process.env.MP_ACCESS_TOKEN;

async function mp(path, opts = {}) {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) throw Object.assign(new Error('Falta MP_ACCESS_TOKEN en las variables de entorno de Vercel.'), { status: 503 });
  const res = await fetch(`${MP}${path}`, {
    ...opts,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(opts.headers || {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw Object.assign(new Error(`Mercado Pago ${res.status}: ${data && (data.message || data.error)}`), { status: res.status, mercadopago: true });
  return data;
}

// The site's public address, for the return links and the notification URL
function sitio(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '');
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}`;
}

const txt = (v, max = 120) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
// Checkout details sent by the page. They go only to Mercado Pago (the repository is public).
function datosCompra(body) {
  const b = body || {}, e = b.entrega || {}, c = b.cliente || {}, d = b.documento || {};
  return {
    pago: ['debito', 'credito', 'cuenta'].includes(b.pago) ? b.pago : '',
    entrega: e.tipo === 'retiro' ? { tipo: 'retiro', local: txt(e.local, 60) } : { tipo: 'envio', direccion: txt(e.direccion), depto: txt(e.depto, 60), comuna: txt(e.comuna, 60) },
    cliente: { nombre: txt(c.nombre, 80), email: txt(c.email), telefono: txt(c.telefono, 20) },
    documento: { tipo: d.tipo === 'factura' ? 'factura' : 'boleta', rut: txt(d.rut, 12), razon: txt(d.razon, 100), giro: txt(d.giro, 100) },
  };
}
function datosInvalidos(d) {
  if (!d.cliente.nombre) return 'Falta el nombre del cliente.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.cliente.email)) return 'El correo no es válido.';
  if (d.entrega.tipo === 'envio' && (!d.entrega.direccion || !d.entrega.comuna)) return 'Falta la dirección de despacho.';
  if (d.documento.tipo === 'factura' && (!d.documento.rut || !d.documento.razon)) return 'Faltan los datos de la factura.';
  return null;
}
const envioDe = (pedido, d) => (d && d.entrega.tipo === 'retiro') || pedido.total >= FREE ? 0 : SHIP;
// Limits the methods shown in Mercado Pago to the one the customer picked
const EXCLUIR = { debito: ['credit_card'], credito: ['debit_card'], cuenta: ['credit_card', 'debit_card'] };

// pedido: the result of registrarPedido. Prices come from the inventory, never from the browser.
async function crearPreferencia(pedido, req, d) {
  const base = sitio(req);
  const envio = envioDe(pedido, d);
  const items = pedido.items.map(it => ({ id: it.sku, title: it.nombre, quantity: it.cantidad, unit_price: it.precio, currency_id: 'CLP' }));
  if (envio) items.push({ id: 'DESPACHO', title: 'Despacho a domicilio', quantity: 1, unit_price: envio, currency_id: 'CLP' });
  const volver = estado => `${base}/?pago=${estado}&pedido=${encodeURIComponent(pedido.pedido)}`;
  const body = {
    items,
    external_reference: pedido.pedido,
    statement_descriptor: 'FARMACIA SAN DANIEL',
    back_urls: { success: volver('aprobado'), pending: volver('pendiente'), failure: volver('rechazado') },
    auto_return: 'approved',
    notification_url: `${base}/api/mercadopago`,
    metadata: { pedido: pedido.pedido },
  };
  if (d) {
    const [nombre, ...apellido] = d.cliente.nombre.split(/\s+/);
    const e = d.entrega, doc = d.documento;
    const direccion = [e.direccion, e.depto, e.comuna].filter(Boolean).join(', ');
    body.payer = { name: nombre, surname: apellido.join(' '), email: d.cliente.email, phone: { number: d.cliente.telefono } };
    if (e.tipo === 'envio') body.payer.address = { street_name: direccion };
    body.additional_info = [
      e.tipo === 'retiro' ? `Retiro en ${e.local}` : `Despacho: ${direccion}`,
      `Cliente: ${d.cliente.nombre}, ${d.cliente.email}, ${d.cliente.telefono}`,
      doc.tipo === 'factura' ? `Factura: ${doc.razon}, RUT ${doc.rut}, giro ${doc.giro}` : `Boleta${doc.rut ? `, RUT ${doc.rut}` : ''}`,
    ].join(' | ');
    body.metadata = { pedido: pedido.pedido, entrega: e, cliente: d.cliente, documento: doc };
    if (EXCLUIR[d.pago]) body.payment_methods = { excluded_payment_types: EXCLUIR[d.pago].map(id => ({ id })) };
  }
  let pref;
  try { pref = await mp('/checkout/preferences', { method: 'POST', body }); }
  catch (e) {
    // if Mercado Pago does not accept the method filter, offer every method instead
    if (!body.payment_methods || e.status !== 400) throw e;
    delete body.payment_methods;
    pref = await mp('/checkout/preferences', { method: 'POST', body });
  }
  const prueba = (process.env.MP_ACCESS_TOKEN || '').startsWith('TEST-');
  return { url: prueba ? pref.sandbox_init_point || pref.init_point : pref.init_point, preferencia: pref.id, total: pedido.total + envio, envio };
}

const obtenerPago = id => mp(`/v1/payments/${encodeURIComponent(id)}`);

// Optional check of the x-signature header, when MP_WEBHOOK_SECRET is set
// (Mercado Pago → Tus integraciones → Webhooks → Clave secreta).
function firmaValida(req, dataId) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true;
  const parts = Object.fromEntries(String(req.headers['x-signature'] || '').split(',').map(p => p.trim().split('=')));
  if (!parts.ts || !parts.v1) return false;
  const id = /^[a-z0-9]+$/i.test(dataId) ? String(dataId).toLowerCase() : dataId;
  const manifest = `id:${id};request-id:${req.headers['x-request-id'] || ''};ts:${parts.ts};`;
  const esperado = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
  return esperado.length === parts.v1.length && crypto.timingSafeEqual(Buffer.from(esperado), Buffer.from(parts.v1));
}

module.exports = { activo, datosCompra, datosInvalidos, crearPreferencia, obtenerPago, firmaValida, FREE, SHIP };
