// pages/api/create-checkout-session.js
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

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

  // Generate signature exactly as Wompi requires
  // Format: reference + amountInCentavos + currency + integritySecret
  const signatureString = `${reference}${amountInCentavos}${currency}${integritySecret}`;
  const signature = crypto.createHash('sha256').update(signatureString).digest('hex');

  // Save order to Supabase before payment
  const orderSummary = items
    .map(i => `${i.quantity}x ${i.name}`)
    .join(', ');

  const { error: dbError } = await supabase.from('orders').insert({
    reference,
    name: customerInfo?.name || '',
    email: customerInfo?.email || '',
    phone: customerInfo?.phone || '',
    city: customerInfo?.city || '',
    region: customerInfo?.region || '',
    address: customerInfo?.address || '',
    notes: customerInfo?.notes || '',
    items: orderSummary,
    total: totalCOP,
    status: 'pendiente',
  });

  if (dbError) {
    console.error('Supabase error:', dbError);
  }

  res.status(200).json({
    publicKey,
    amountInCentavos,
    reference,
    signature,
    redirectUrl: `${siteUrl}/success`,
    currency,
  });
}