// POST /api/mercadopago  — notifications from Mercado Pago (webhook / IPN).
// Reads the payment from Mercado Pago itself and logs its status in data/pagos.csv.
const { obtenerPago, firmaValida } = require('./_lib/mercadopago');
const { registrarPago } = require('./_lib/inventario');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  const q = req.query || {};
  const tipo = (body && (body.type || body.topic)) || q.type || q.topic;
  const id = (body && body.data && body.data.id) || q['data.id'] || q.id;
  // merchant_order and other topics are not needed: every payment arrives on its own
  if (tipo !== 'payment' || !id) return res.status(200).json({ ok: true, ignorado: tipo || 'sin tipo' });
  if (!firmaValida(req, q['data.id'] || id)) return res.status(401).json({ error: 'Firma inválida.' });
  try {
    const pago = await obtenerPago(id);
    if (!pago.external_reference) return res.status(200).json({ ok: true, ignorado: 'pago sin pedido' });
    const r = await registrarPago({
      pedido: pago.external_reference,
      fecha: (pago.date_last_updated || pago.date_created || new Date().toISOString()).replace(/\.\d+/, ''),
      pagoId: pago.id,
      estado: pago.status,
      detalle: pago.status_detail,
      monto: pago.transaction_amount,
      medio: pago.payment_method_id,
    });
    return res.status(200).json({ ok: true, ...r });
  } catch (e) {
    console.error(e);
    // a non-2xx answer makes Mercado Pago retry the notification later
    return res.status(e.status === 404 ? 200 : 500).json({ error: 'No pudimos registrar el pago.' });
  }
};
