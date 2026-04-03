import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../lib/CartContext';
import CartDrawer from './CartDrawer';
 
const navLinks = [
  { label: 'Lubricantes', href: '/shop?category=Lubricantes' },
  { label: 'Lencería', href: '/shop?category=Lencer%C3%ADa' },
  { label: 'Juegos', href: '/shop?category=Juegos+Sexuales' },
  { label: 'Juguetes', href: '/shop?category=Vibradores+y+Consoladores' },
];
 
export default function Navbar() {
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
        background: scrolled || menuOpen ? 'rgba(10,10,10,0.98)' : 'rgba(10,10,10,0.7)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2a2a3a',
        transition: 'all 0.4s ease',
      }}>
        {/* Top bar */}
        <div style={{
          background: '#c8385a', textAlign: 'center',
          padding: '0.4rem 1rem', fontSize: '0.68rem',
          fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'white',
        }}>
          🚚 Envío Rápido y Discreto · Empaque 100% Confidencial
        </div>
 
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.9rem 1.25rem', maxWidth: 1240, margin: '0 auto',
        }}>
          {/* Logo */}
          <Link href="/">
            <img src="/logo.png" alt="All Yours" style={{ height: 52, width: 'auto', objectFit: 'contain' }} />
          </Link>
 
          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {navLinks.map(link => (
              <Link key={link.label} href={link.href} style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888899', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#f5f0ee'}
                onMouseLeave={e => e.target.style.color = '#888899'}
              >{link.label}</Link>
            ))}
          </div>
 
          {/* Right: cart + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={() => setCartOpen(true)} style={{
              background: 'transparent', border: '1px solid #2a2a3a', borderRadius: 6,
              color: '#f5f0ee', padding: '0.5rem 0.85rem',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#c8385a'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a3a'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span className="cart-label">Carrito</span>
              {totalItems > 0 && (
                <span style={{ background: '#c8385a', color: 'white', borderRadius: '50%', width: 19, height: 19, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>{totalItems}</span>
              )}
            </button>
 
            {/* Hamburger */}
            <button onClick={() => setMenuOpen(m => !m)} className="hamburger" style={{
              background: 'none', border: '1px solid #2a2a3a', borderRadius: 6,
              padding: '0.5rem', color: '#f5f0ee', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: '4px',
              alignItems: 'center', justifyContent: 'center', width: 38, height: 38,
            }}>
              <span style={{ width: 18, height: 1.5, background: '#f5f0ee', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
              <span style={{ width: 18, height: 1.5, background: '#f5f0ee', display: 'block', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.3s' }} />
              <span style={{ width: 18, height: 1.5, background: '#f5f0ee', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
            </button>
          </div>
        </div>
 
        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu" style={{ borderTop: '1px solid #2a2a3a', padding: '0.5rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column' }}>
            {navLinks.map(link => (
              <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)} style={{
                padding: '0.85rem 0', borderBottom: '1px solid #1a1a2a',
                fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#888899',
              }}>{link.label}</Link>
            ))}
          </div>
        )}
      </nav>
 
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
 
      <style jsx global>{`
        @media (min-width: 640px) {
          .hamburger { display: none !important; }
          .mobile-menu { display: none !important; }
        }
        @media (max-width: 639px) {
          .desktop-nav { display: none !important; }
          .cart-label { display: none; }
        }
      `}</style>
    </>
  );
}