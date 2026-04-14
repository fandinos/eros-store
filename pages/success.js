// pages/success.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCart } from '../lib/CartContext';

export default function Success() {
  const { clearCart } = useCart();
  const router = useRouter();
  const { method, msg } = router.query;
  const isContraEntrega = method === 'contra_entrega';

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main style={{ padding: '6rem 0', textAlign: 'center', minHeight: '70vh' }}>
      <div className="container">
        <div style={{
          background: '#16161f',
          border: `1px solid ${isContraEntrega ? '#c9a84c44' : '#2a9a7a44'}`,
          borderRadius: 16,
          padding: '4rem 2rem',
          maxWidth: 560,
          margin: '0 auto',
        }}>
          
          {/* Icon */}
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: isContraEntrega ? 'rgba(201,168,76,0.15)' : 'rgba(42,154,122,0.15)',
            border: `2px solid ${isContraEntrega ? '#c9a84c' : '#2a9a7a'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '1.8rem',
          }}>
            {isContraEntrega ? '🤝' : '✓'}
          </div>

          {/* Status */}
          <p style={{
            fontSize: '0.68rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: isContraEntrega ? '#c9a84c' : '#2a9a7a',
            marginBottom: '0.75rem',
            fontWeight: 600,
          }}>
            {isContraEntrega ? 'Pedido Recibido' : 'Pago Confirmado'}
          </p>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.5rem',
            fontWeight: 300,
            color: '#f5f0ee',
            marginBottom: '1rem',
            lineHeight: 1.2,
          }}>
            {isContraEntrega ? '¡Pedido enviado!' : '¡Gracias por tu compra!'}
          </h1>

          {/* Description */}
          <p style={{
            color: '#555566',
            lineHeight: 1.75,
            marginBottom: '2rem',
            fontSize: '0.9rem'
          }}>
            {isContraEntrega
              ? 'Recibimos tu pedido. Confirma tu orden por WhatsApp y coordinaremos el pago y la entrega contigo.'
              : 'Tu pago fue procesado exitosamente. Confirma tu orden por WhatsApp para que podamos preparar tu envío.'}
          </p>

          {/* Delivery / Steps */}
          <div style={{
            background: '#111118',
            borderRadius: 8,
            padding: '1rem 1.5rem',
            marginBottom: '2rem',
            border: '1px solid #2a2a3a',
          }}>
            <p style={{
              fontSize: '0.72rem',
              color: '#555566',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              {isContraEntrega ? 'Próximos pasos' : 'Entrega estimada'}
            </p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.1rem',
              color: '#f5f0ee',
              marginTop: '0.25rem'
            }}>
              {isContraEntrega
                ? 'Confirma por WhatsApp → Coordinamos entrega'
                : '24–48 horas hábiles tras confirmar por WhatsApp'}
            </p>
          </div>

          {/* WhatsApp button */}
          <a
            href={
              msg
                ? `https://wa.me/573112494003?text=${encodeURIComponent(msg)}`
                : 'https://wa.me/573112494003'
            }
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              background: '#25D366',
              color: 'white',
              borderRadius: 8,
              padding: '1rem 1.5rem',
              marginBottom: '1rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '0.04em',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Confirmar Orden por WhatsApp
          </a>

          {/* Footer note */}
          <p style={{ fontSize: '0.75rem', color: '#444455', marginBottom: '2rem' }}>
            {isContraEntrega
              ? '⚠️ Tu pedido no estará confirmado hasta que nos contactes por WhatsApp'
              : '📦 Empaque 100% discreto · Sin logos visibles'}
          </p>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
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