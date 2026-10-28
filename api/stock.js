// GET /api/stock  ->  { stock: { "MED-001": 34, ... }, version: "<commit>" }
const { stockActual } = require('./_lib/inventario');

module.exports = async (req, res) => {
  try {
    const r = await stockActual();
    res.setHeader('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=30');
    return res.status(200).json(r);
  } catch (e) {
    console.error(e);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(e.status === 503 ? 503 : 502).json({ error: 'No pudimos leer el inventario.' });
  }
};
