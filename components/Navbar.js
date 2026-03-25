// components/Navbar.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../lib/CartContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(10,10,10,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #2a2a3a' : '1px solid transparent',
        transition: 'all 0.4s ease',
      }}>
        {/* Top bar */}
        <div style={{
          background: '#c8385a',
          textAlign: 'center',
          padding: '0.45rem',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'white',
        }}>
          🚚 Envío Rápido y Discreto · Empaque 100% Confidencial
        </div>

        <div className="container" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.5rem',
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.6rem',
              fontWeight: 300,
              letterSpacing: '0.2em',
              color: '#f5f0ee',
              lineHeight: 1,
            }}>EROS</span>
            <span style={{
              fontSize: '0.55rem',
              letterSpacing: '0.35em',
              color: '#c8385a',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}>Tienda Íntima</span>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            {[
              { label: 'Lubricantes', href: '/shop?category=Lubricantes' },
              { label: 'Lencería', href: '/shop?category=Lencer%C3%ADa' },
              { label: 'Juegos', href: '/shop?category=Juegos+Sexuales' },
              { label: 'Juguetes', href: '/shop?category=Vibradores+y+Consoladores' },
            ].map(link => (
              <Link key={link.label} href={link.href} style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#888899',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.target.style.color = '#f5f0ee'}
                onMouseLeave={e => e.target.style.color = '#888899'}
              >{link.label}</Link>
            ))}
          </div>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            style={{
              background: 'transparent',
              border: '1px solid #2a2a3a',
              borderRadius: 6,
              color: '#f5f0ee',
              padding: '0.55rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.78rem',
              fontWeight: 500,
              letterSpacing: '0.06em',
              transition: 'border-color 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#c8385a'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a3a'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            Carrito
            {totalItems > 0 && (
              <span style={{
                background: '#c8385a', color: 'white',
                borderRadius: '50%', width: 20, height: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700,
              }}>{totalItems}</span>
            )}
          </button>
        </div>
      </nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
