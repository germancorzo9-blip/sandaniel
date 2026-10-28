// GET /api/stock  ->  { stock: { "MED-001": 34, ... }, version: "<commit>", mercadopago: true }
const { stockActual } = require('./_lib/inventario');
const mercadopago = require('./_lib/mercadopago');

module.exports = async (req, res) => {
  try {
    const r = await stockActual();
    // tells the page whether to offer online payment
    r.mercadopago = mercadopago.activo();
    res.setHeader('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=30');
    return res.status(200).json(r);
  } catch (e) {
    console.error(e);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(e.status === 503 ? 503 : 502).json({ error: 'No pudimos leer el inventario.' });
  }
};
