// pages/api/create-checkout-session.js
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { items } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items provided' });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const publicKey = process.env.WOMPI_PUBLIC_KEY;
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET; // different from private key!

  // Calculate total
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 100000 ? 0 : 12000;
  const totalCOP = subtotal + shipping;
  const amountInCentavos = totalCOP * 100;

  // Unique reference
  const reference = `ALLYOURS-${Date.now()}`;
  const currency = 'COP';

  // Wompi signature format: reference + amountInCentavos + currency + integritySecret
  // Then SHA256 hash of that string
  const signatureString = `${reference}${amountInCentavos}${currency}${integritySecret}`;
  const signature = crypto
    .createHash('sha256')
    .update(signatureString)
    .digest('hex');

  res.status(200).json({
    publicKey,
    amountInCentavos,
    reference,
    signature,
    redirectUrl: `${siteUrl}/success`,
    currency,
  });
}