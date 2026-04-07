// components/ProductCard.js
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../lib/CartContext';
import { formatPrice } from '../lib/products';

const BADGE_COLORS = {
  'Popular':       { bg: '#c8385a', color: 'white' },
  'Nuevo':         { bg: '#2a7a6a', color: 'white' },
  'Mejor Valor':   { bg: '#c9a84c', color: '#0a0a0a' },
  'Bestseller':    { bg: '#c8385a', color: 'white' },
  'Hot 🔥':        { bg: '#9e1f3e', color: 'white' },
  'Premium':       { bg: '#c9a84c', color: '#0a0a0a' },
  'Favorita':      { bg: '#7a3a7a', color: 'white' },
  'Exclusivo':     { bg: '#c9a84c', color: '#0a0a0a' },
  'Para Él':       { bg: '#1a4a7a', color: 'white' },
  'Top Ventas':    { bg: '#c8385a', color: 'white' },
  'Más Vendido':   { bg: '#c8385a', color: 'white' },
  'Para Principiantes': { bg: '#2a6a4a', color: 'white' },
  'Incluye Lubricante': { bg: '#2a7a6a', color: 'white' },
};

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const badgeStyle = product.badge
    ? BADGE_COLORS[product.badge] || { bg: '#555566', color: 'white' }
    : null;

  return (
    <div
      className="card"
      style={{ display: 'flex', flexDirection: 'column' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Link href={`/product/${product.id}`} style={{ display: 'block', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', paddingTop: '100%', overflow: 'hidden', background: '#1a1a26' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              filter: 'brightness(0.85)',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 50%)',
          }} />
          {product.badge && (
            <span className="badge" style={{
              position: 'absolute', top: 12, left: 12,
              background: badgeStyle.bg, color: badgeStyle.color,
            }}>
              {product.badge}
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <span style={{
          fontSize: '0.75rem', color: '#c8385a', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          {product.category}
        </span>

        <Link href={`/product/${product.id}`}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.1rem', fontWeight: 400,
            color: '#f5f0ee', lineHeight: 1.3,
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = '#c8385a'}
            onMouseLeave={e => e.target.style.color = '#f5f0ee'}
          >{product.name}</h3>
        </Link>

        <p style={{ fontSize: '0.82rem', color: '#555566', lineHeight: 1.5, flex: 1 }}>
          {product.description.slice(0, 75)}...
        </p>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginTop: '0.5rem',
          paddingTop: '0.75rem', borderTop: '1px solid #2a2a3a',
          gap: '0.5rem',
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.2rem', fontWeight: 400, color: '#c9a84c',
            flexShrink: 0,
          }}>
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAdd}
            style={{
              background: added ? '#2a6a4a' : '#c8385a',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '0.35rem 0.6rem',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background 0.3s',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {added ? '✓ Agregado' : '+ Carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}