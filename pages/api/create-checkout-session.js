// pages/api/create-checkout-session.js
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Log env vars to debug (remove after fixing)
  console.log('SUPABASE URL exists:', !!supabaseUrl);
  console.log('SUPABASE KEY exists:', !!supabaseKey);
  console.log('WOMPI KEY exists:', !!publicKey);
  console.log('INTEGRITY SECRET exists:', !!integritySecret);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 100000 ? 0 : 12000;
  const totalCOP = subtotal + shipping;
  const amountInCentavos = totalCOP * 100;

  const reference = `ALLYOURS-${Date.now()}`;
  const currency = 'COP';

  const signatureString = `${reference}${amountInCentavos}${currency}${integritySecret}`;
  const signature = crypto.createHash('sha256').update(signatureString).digest('hex');

  // Order summary with product details
  const orderSummary = items
    .map(i => `${i.quantity}x ${i.name}`)
    .join(', ');

  console.log('Order summary:', orderSummary);
  console.log('Customer:', customerInfo);

  // Save to Supabase
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error: dbError } = await supabase
      .from('orders')
      .insert({
        reference,
        name: customerInfo?.name || '',
        phone: customerInfo?.phone || '',
        city: customerInfo?.city || '',
        address: customerInfo?.address || '',
        notes: customerInfo?.notes || '',
        items: orderSummary,
        total: totalCOP,
        status: req.body.paymentMethod === 'contra_entrega' ? 'contra_entrega' : 'pendiente',
      })
      .select();

    if (dbError) {
      console.error('Supabase INSERT error:', JSON.stringify(dbError, null, 2));
    } else {
      console.log('✅ Order saved to Supabase:', data);
    }
  } catch (e) {
    console.error('Supabase connection error:', e.message);
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