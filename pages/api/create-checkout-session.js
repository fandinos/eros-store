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
  const privateKey = process.env.WOMPI_PRIVATE_KEY;

  // Calculate total in centavos (Wompi uses centavos of COP)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 150000 ? 0 : 15000;
  const totalCOP = subtotal + shipping;
  const amountInCentavos = totalCOP * 100; // Wompi needs centavos

  // Generate unique reference
  const reference = `EROS-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  // Generate integrity signature
  // Format: reference + amountInCentavos + currency + privateKey
  const signatureString = `${reference}${amountInCentavos}COP${privateKey}`;
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
    currency: 'COP',
  });
}