// pages/success.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../lib/CartContext';

export default function Success() {
  const { clearCart } = useCart();
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    clearCart();

    const orderInfo = sessionStorage.getItem('order-info');
    if (orderInfo && !notified) {
      try {
        const info = JSON.parse(orderInfo);

        // Encode message to avoid breaking URL
        const encodedMessage = encodeURIComponent(info.notifyMessage);

        window.open(
          `https://wa.me/573112494003?text=${encodedMessage}`,
          '_blank'
        );

        sessionStorage.removeItem('order-info');
        setNotified(true);
      } catch (e) {}
    }
  }, [notified, clearCart]);

  return (
    <main style={{ padding: '6rem 0', textAlign: 'center', minHeight: '70vh' }}>
      <div className="container">
        <div
          style={{
            background: '#16161f',
            border: '1px solid #c9a84c44',
            borderRadius: 16,
            padding: '4rem 2rem',
            maxWidth: 540,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(42,154,122,0.15)',
              border: '2px solid #2a9a7a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '1.8rem',
            }}
          >
            ✓
          </div>

          <p
            style={{
              fontSize: '0.68rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#c9a84c',
              marginBottom: '0.75rem',
              fontWeight: 600,
            }}
          >
            Pedido Confirmado
          </p>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.5rem',
              fontWeight: 300,
              color: '#f5f0ee',
              marginBottom: '1rem',
              lineHeight: 1.2,
            }}
          >
            ¡Gracias por tu compra!
          </h1>

          <p
            style={{
              color: '#555566',
              lineHeight: 1.75,
              marginBottom: '2rem',
              fontSize: '0.9rem',
            }}
          >
            Tu pedido ha sido procesado exitosamente.
            <br />
            Nos pondremos en contacto contigo pronto para confirmar el envío.
          </p>

          <div
            style={{
              background: '#111118',
              borderRadius: 8,
              padding: '1rem 1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid #2a2a3a',
            }}
          >
            <p
              style={{
                fontSize: '0.72rem',
                color: '#555566',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Entrega estimada
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.1rem',
                color: '#f5f0ee',
                marginTop: '0.25rem',
              }}
            >
              24–48 horas hábiles
            </p>
          </div>

          {/* Contact via WhatsApp */}
          <a
            href="https://wa.me/573112494003"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: '#25D366',
              color: 'white',
              borderRadius: 6,
              padding: '0.85rem',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>
            Contactar por WhatsApp
          </a>

          <p style={{ fontSize: '0.8rem', color: '#444455', marginBottom: '2rem' }}>
            🔒 Empaque 100% discreto · Sin logos visibles
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
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