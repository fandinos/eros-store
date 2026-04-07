// components/CartDrawer.js
import Link from 'next/link';
import { useCart } from '../lib/CartContext';
import { formatPrice } from '../lib/products';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQty, totalPrice } = useCart();
  const shipping = totalPrice >= 100000 ? 0 : 12000;
  const total = totalPrice + shipping;

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 200,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'opacity 0.3s',
        backdropFilter: isOpen ? 'blur(4px)' : 'none',
      }} />

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(420px, 100vw)',
        background: '#111118',
        border: '1px solid #2a2a3a',
        zIndex: 201,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(.4,0,.2,1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem', borderBottom: '1px solid #2a2a3a',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 300 }}>
              Tu Carrito
            </h2>
            <p style={{ fontSize: '0.72rem', color: '#555566', marginTop: '0.2rem' }}>
              {items.length} producto{items.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a3a',
            color: '#888899', width: 34, height: 34, borderRadius: '50%',
            fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#c8385a'; e.currentTarget.style.color = '#c8385a'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a3a'; e.currentTarget.style.color = '#888899'; }}
          >✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#555566' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.4 }}>🛍</div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                Tu carrito está vacío
              </p>
              <p style={{ fontSize: '0.82rem', marginBottom: '1.5rem' }}>Agrega productos para continuar</p>
              <button onClick={onClose} className="btn-primary">Ver Catálogo</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} style={{
                display: 'flex', gap: '1rem', alignItems: 'center',
                padding: '1rem 0', borderBottom: '1px solid #2a2a3a',
              }}>
                <img src={item.image} alt={item.name} style={{
                  width: 70, height: 70, objectFit: 'cover', borderRadius: 8,
                  border: '1px solid #2a2a3a', filter: 'brightness(0.9)',
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontWeight: 400, marginBottom: '0.2rem' }}>
                    {item.name}
                  </p>
                  <p style={{ color: '#c9a84c', fontWeight: 600, fontSize: '0.9rem' }}>
                    {formatPrice(item.price)}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} style={qtyBtn}>−</button>
                    <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} style={qtyBtn}>+</button>
                    <button onClick={() => removeItem(item.id)} style={{
                      marginLeft: 'auto', background: 'none', border: 'none',
                      color: '#555566', cursor: 'pointer', fontSize: '0.9rem',
                      transition: 'color 0.2s',
                    }}
                      onMouseEnter={e => e.target.style.color = '#c8385a'}
                      onMouseLeave={e => e.target.style.color = '#555566'}
                    >Eliminar</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid #2a2a3a' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#555566' }}>
                <span>Subtotal</span><span>{formatPrice(totalPrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#555566' }}>
                <span>Envío</span>
                <span style={{ color: shipping === 0 ? '#2a9a7a' : undefined }}>
                  {shipping === 0 ? 'GRATIS 🎉' : formatPrice(shipping)}
                </span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem',
                borderTop: '1px solid #2a2a3a', paddingTop: '0.75rem', marginTop: '0.25rem',
                color: '#c9a84c',
              }}>
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link href="/checkout" onClick={onClose}>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}>
                Proceder al Pago
              </button>
            </Link>
            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#444455', marginTop: '0.75rem' }}>
              🔒 Pago seguro · 📦 Envío discreto
            </p>
          </div>
        )}
      </div>
    </>
  );
}

const qtyBtn = {
  width: 26, height: 26, borderRadius: 4,
  border: '1px solid #2a2a3a', background: 'transparent',
  color: '#888899', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
};
