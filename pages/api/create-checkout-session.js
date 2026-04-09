// pages/api/create-checkout-session.js
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { items, customerInfo } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items provided' });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const publicKey = process.env.WOMPI_PUBLIC_KEY;
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 100000 ? 0 : 12000;
  const totalCOP = subtotal + shipping;
  const amountInCentavos = totalCOP * 100;

  const reference = `ALLYOURS-${Date.now()}`;
  const currency = 'COP';

  const signatureString = `${reference}${amountInCentavos}${currency}${integritySecret}`;
  const signature = crypto.createHash('sha256').update(signatureString).digest('hex');

  // Build Wompi params with customer info pre-filled
  const params = new URLSearchParams({
    'public-key': publicKey,
    'currency': currency,
    'amount-in-cents': amountInCentavos,
    'reference': reference,
    'signature:integrity': signature,
    'redirect-url': `${siteUrl}/success`,
    'tax-in-cents:vat': Math.round(amountInCentavos * 0.19),
  });

  if (customerInfo) {
    if (customerInfo.email) params.set('customer-data:email-address-hint', customerInfo.email);
    if (customerInfo.phone) params.set('customer-data:phone-number-hint', customerInfo.phone);
    if (customerInfo.name) params.set('customer-data:full-name-hint', customerInfo.name);
  }

  // Send WhatsApp notification to yourself via wa.me link stored in order
  // We'll notify via email summary in the reference
  try {
    const orderSummary = items.map(i => `${i.quantity}x ${i.name}`).join(', ');
    const notifyMessage = encodeURIComponent(
      `🛍 NUEVO PEDIDO - All Yours\n\n` +
      `👤 Cliente: ${customerInfo?.name}\n` +
      `📱 Tel: ${customerInfo?.phone}\n` +
      `📧 Email: ${customerInfo?.email}\n` +
      `📍 Ciudad: ${customerInfo?.city}\n` +
      `🏠 Dirección: ${customerInfo?.address}\n` +
      `📝 Notas: ${customerInfo?.notes || 'Ninguna'}\n\n` +
      `🛒 Productos: ${orderSummary}\n` +
      `💰 Total: $${totalCOP.toLocaleString('es-CO')} COP\n` +
      `🔖 Referencia: ${reference}`
    );

    // Store order info to display on success page
    res.status(200).json({
      wompiParams: params.toString(),
      orderInfo: {
        reference,
        customer: customerInfo,
        items: items.map(i => ({ name: i.name, qty: i.quantity, price: i.price })),
        total: totalCOP,
        notifyMessage,
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}