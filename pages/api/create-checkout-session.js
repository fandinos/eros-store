// pages/api/create-checkout-session.js
import Stripe from 'stripe';
 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 
  const { items } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items provided' });
  }
 
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
 
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'cop',  // Colombian Peso
        product_data: {
          name: item.name,
          description: item.description?.slice(0, 200),
          images: item.image ? [item.image] : [],
        },
        unit_amount: item.price * 100, // price in COP (no decimals needed)
      },
      quantity: item.quantity,
    }));
 
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      phone_number_collection: { enabled: false },
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['CO'], // Colombia only
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'cop' },
            display_name: 'Envío Estándar',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 1500000, currency: 'cop' }, // $15.000 COP express
            display_name: 'Envío Express 24–48h',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 2 },
            },
          },
        },
      ],
      locale: 'es',  // Spanish checkout page
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
      metadata: {
        order_items: JSON.stringify(items.map(i => ({ id: i.id, qty: i.quantity }))),
      },
    });
 
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
}