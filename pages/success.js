// pages/success.js
import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../lib/CartContext';

export default function Success() {
  const { clearCart } = useCart();
  useEffect(() => { clearCart(); }, []);

  return (
    <main style={{ padding: '6rem 0', textAlign: 'center', minHeight: '70vh' }}>
      <div className="container">
        <div style={{
          background: '#16161f',
          border: '1px solid #c9a84c44',
          borderRadius: 16,
          padding: '4rem 2rem',
          maxWidth: 540,
          margin: '0 auto',
        }}>
          {/* Animated check */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(42,154,122,0.15)',
            border: '2px solid #2a9a7a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '1.8rem',
          }}>✓</div>

          <p style={{
            fontSize: '0.68rem', letterSpacing: '0.25em',
            textTransform: 'uppercase', color: '#c9a84c',
            marginBottom: '0.75rem', fontWeight: 600,
          }}>Pedido Confirmado</p>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.5rem', fontWeight: 300,
            color: '#f5f0ee', marginBottom: '1rem', lineHeight: 1.2,
          }}>
            ¡Gracias por tu compra!
          </h1>

          <p style={{ color: '#555566', lineHeight: 1.75, marginBottom: '2rem', fontSize: '0.9rem' }}>
            Tu pedido ha sido procesado exitosamente.<br />
            Recibirás un email de confirmación con los detalles de tu envío.
          </p>

          <div style={{
            background: '#111118', borderRadius: 8, padding: '1rem 1.5rem',
            marginBottom: '2rem', border: '1px solid #2a2a3a',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '0.72rem', color: '#555566', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Entrega estimada</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: '#f5f0ee', marginTop: '0.25rem' }}>
                  24–48 horas hábiles
                </p>
              </div>
              <span style={{ fontSize: '1.8rem' }}>📦</span>
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#444455', marginBottom: '2rem' }}>
            🔒 Empaque 100% discreto · Sin logos visibles
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/shop">
              <button className="btn-primary">Seguir Comprando</button>
            </Link>
            <Link href="/">
              <button className="btn-outline">Volver al Inicio</button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
