// pages/checkout.js
import { useState } from 'react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '../lib/CartContext';
import { formatPrice } from '../lib/products';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shipping = totalPrice >= 15000 ? 0 : 599;
  const tax = Math.round(totalPrice * 0.19); // IVA Colombia 19%
  const orderTotal = totalPrice + shipping + tax;

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const { sessionId, error: apiError } = await res.json();
      if (apiError) throw new Error(apiError);
      const stripe = await stripePromise;
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      if (stripeError) throw new Error(stripeError.message);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main style={{ padding: '6rem 0', textAlign: 'center', minHeight: '60vh' }}>
        <div className="container">
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.25em', color: '#c8385a', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Carrito Vacío
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, marginBottom: '1.5rem' }}>
            Tu carrito está vacío
          </h1>
          <Link href="/shop">
            <button className="btn-primary">Ver Catálogo</button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: '4rem 0', minHeight: '70vh' }}>
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.25em', color: '#c8385a', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
            Finalizar Compra
          </p>
          <h1 className="section-title">Resumen del Pedido</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Order summary */}
          <div style={{
            background: '#16161f', border: '1px solid #2a2a3a',
            borderRadius: 12, padding: '1.5rem',
          }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 300, marginBottom: '1.25rem', color: '#f5f0ee' }}>
              Productos
            </h2>
            {items.map(item => (
              <div key={item.id} style={{
                display: 'flex', gap: '1rem', alignItems: 'center',
                padding: '0.75rem 0', borderBottom: '1px solid #2a2a3a',
              }}>
                <img src={item.image} alt={item.name} style={{
                  width: 60, height: 60, objectFit: 'cover', borderRadius: 8,
                  border: '1px solid #2a2a3a', filter: 'brightness(0.9)',
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: '#f5f0ee' }}>{item.name}</p>
                  <p style={{ color: '#555566', fontSize: '0.78rem' }}>Cant: {item.quantity}</p>
                </div>
                <span style={{ color: '#c9a84c', fontWeight: 600, fontSize: '0.9rem' }}>
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}

            {/* Totals */}
            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#555566' }}>
                <span>Subtotal</span><span>{formatPrice(totalPrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#555566' }}>
                <span>Envío</span>
                <span style={{ color: shipping === 0 ? '#2a9a7a' : undefined }}>
                  {shipping === 0 ? 'GRATIS 🎉' : formatPrice(shipping)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#555566' }}>
                <span>IVA (19%)</span><span>{formatPrice(tax)}</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 300,
                borderTop: '1px solid #2a2a3a', paddingTop: '0.75rem', marginTop: '0.25rem',
                color: '#c9a84c',
              }}>
                <span>Total</span><span>{formatPrice(orderTotal)}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div style={{
            background: '#16161f', border: '1px solid #2a2a3a',
            borderRadius: 12, padding: '1.5rem',
          }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 300, marginBottom: '0.5rem', color: '#f5f0ee' }}>
              🔒 Pago Seguro
            </h2>
            <p style={{ color: '#555566', fontSize: '0.83rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Serás redirigido a la pasarela de pago segura de Stripe.
              Nunca almacenamos tus datos bancarios.
            </p>

            {/* Accepted cards */}
            <div style={{
              background: '#111118', borderRadius: 8, padding: '1rem',
              border: '1px solid #2a2a3a', marginBottom: '1.5rem',
            }}>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555566', marginBottom: '0.75rem' }}>
                Métodos aceptados
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay'].map(p => (
                  <span key={p} style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid #2a2a3a',
                    borderRadius: 4, padding: '0.3rem 0.7rem',
                    fontSize: '0.75rem', color: '#888899', fontWeight: 500,
                  }}>{p}</span>
                ))}
              </div>
            </div>

            {/* Guarantees */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {[
                '📦 Empaque 100% discreto y confidencial',
                '🚚 Envío express en 24–48 horas',
                '🔒 Transacción encriptada SSL',
                '↩️ Devolución fácil garantizada',
              ].map(g => (
                <p key={g} style={{ fontSize: '0.8rem', color: '#555566' }}>{g}</p>
              ))}
            </div>

            {error && (
              <div style={{
                background: 'rgba(200,56,90,0.1)', color: '#e05070',
                border: '1px solid #c8385a44',
                borderRadius: 8, padding: '0.75rem 1rem',
                marginBottom: '1rem', fontSize: '0.85rem',
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              className="btn-primary"
              onClick={handleCheckout}
              disabled={loading}
              style={{
                width: '100%', justifyContent: 'center',
                padding: '1rem', fontSize: '0.85rem',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? '⏳ Redirigiendo...' : `Pagar ${formatPrice(orderTotal)}`}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link href="/shop" style={{ color: '#555566', fontSize: '0.8rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#c8385a'}
                onMouseLeave={e => e.target.style.color = '#555566'}
              >
                ← Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
