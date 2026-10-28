// POST /api/pedido  { items: [{ sku: "MED-001", cantidad: 2 }, ...] }
// Lowers the stock in data/inventario.csv and logs the order in data/pedidos.csv.
const { registrarPedido, accesoToken } = require('./_lib/inventario');
const mercadopago = require('./_lib/mercadopago');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Usa POST para enviar un pedido.' });
  }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  try {
    // checkout details (delivery, customer, billing) are checked before reserving any stock
    const datos = body && body.cliente ? mercadopago.datosCompra(body) : null;
    const invalido = datos && mercadopago.datosInvalidos(datos);
    if (invalido) return res.status(400).json({ error: invalido });
    const r = await registrarPedido(body && body.items);
    // With MP_ACCESS_TOKEN the customer pays online; if Mercado Pago fails the order stays
    // reserved and the page tells the customer.
    if (mercadopago.activo()) {
      try { r.pago = await mercadopago.crearPreferencia(r, req, datos); }
      // the Mercado Pago message (never the token) helps fix the setup
      catch (e) { console.error(e); r.pagoError = 'No pudimos abrir el pago con Mercado Pago.'; r.pagoDetalle = e.message; }
    }
    return res.status(201).json(r);
  } catch (e) {
    if (e.faltantes) return res.status(409).json({ error: 'No hay stock suficiente para algunos productos.', faltantes: e.faltantes });
    if (e.status && e.status < 500 && !e.github) return res.status(e.status).json({ error: e.message });
    console.error(e);
    // the GitHub status and message help the pharmacy fix the setup; they never include the token
    const acceso = e.status === 403 || e.status === 404 ? await accesoToken() : undefined;
    return res.status(e.status === 503 ? 503 : 502).json({ error: 'No pudimos registrar el pedido en el inventario. Intenta de nuevo en unos segundos.', detalle: e.github ? e.message : undefined, acceso });
  }
};
