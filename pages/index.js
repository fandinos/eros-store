// pages/index.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { products, categories, getProductsByCategory } from '../lib/products';
import ProductCard from '../components/ProductCard';

const CATEGORY_CONFIG = {
  'Lubricantes':               { emoji: '💧', desc: 'Base acuosa, saborizados y especiales', color: '#c8385a' },
  'Lencería':                  { emoji: '🌹', desc: 'Conjuntos, disfraces y más', color: '#c9a84c' },
  'Juegos Sexuales':           { emoji: '🎲', desc: 'Para parejas aventureras', color: '#7a3a9a' },
  'Vibradores y Consoladores': { emoji: '⚡', desc: 'Para él, ella y ambos', color: '#c8385a' },
};

export default function Home() {
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const confirmed = sessionStorage.getItem('age-confirmed');
    if (confirmed) setAgeConfirmed(true);
    setChecking(false);
  }, []);

  const confirmAge = () => {
    sessionStorage.setItem('age-confirmed', 'true');
    setAgeConfirmed(true);
  };

  if (checking) return null;

  return (
    <>
      {/* AGE GATE */}
      {!ageConfirmed && (
        <div className="age-gate">
          <div style={{
            textAlign: 'center', padding: '3rem 2rem',
            maxWidth: 440,
            border: '1px solid #2a2a3a', borderRadius: 12,
            background: '#111118',
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '0.75rem', letterSpacing: '0.35em',
              textTransform: 'uppercase', color: '#c8385a',
              marginBottom: '1rem',
            }}>Verificación de Edad</div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.5rem', fontWeight: 300,
              color: '#f5f0ee', marginBottom: '1rem', lineHeight: 1.2,
            }}>
              ¿Eres mayor<br />de 18 años?
            </h1>
            <p style={{ color: '#555566', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Este sitio contiene material para adultos.<br />
              Al ingresar confirmas ser mayor de edad.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={confirmAge} style={{ padding: '0.85rem 2.5rem' }}>
                Sí, soy mayor de 18
              </button>
              <button
                className="btn-outline"
                onClick={() => window.location.href = 'https://google.com'}
              >
                No, salir
              </button>
            </div>
          </div>
        </div>
      )}

      <main>
        {/* HERO */}
        <section style={{
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a12 50%, #0a0a0a 100%)',
        }}>
          {/* Background pattern */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(200,56,90,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(201,168,76,0.08) 0%, transparent 50%)',
          }} />
          {/* Vertical lines decoration */}
          <div style={{
            position: 'absolute', right: '8%', top: 0, bottom: 0, width: 1,
            background: 'linear-gradient(to bottom, transparent, #c8385a44, transparent)',
          }} />
          <div style={{
            position: 'absolute', right: '12%', top: 0, bottom: 0, width: 1,
            background: 'linear-gradient(to bottom, transparent, #c9a84c22, transparent)',
          }} />

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: 620 }}>
              <p style={{
                fontSize: '0.72rem', letterSpacing: '0.35em', textTransform: 'uppercase',
                color: '#c8385a', marginBottom: '1.5rem', fontWeight: 600,
              }}>
                — Sexual Boutique —
              </p>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                color: '#f5f0ee',
                marginBottom: '1.5rem',
                letterSpacing: '0.02em',
              }}>
                El placer<br />
                <span style={{ color: '#c8385a', fontStyle: 'italic' }}>comienza</span><br />
                aquí
              </h1>
              <p style={{
                color: '#888899', fontSize: '1rem', lineHeight: 1.7,
                maxWidth: 440, marginBottom: '2.5rem',
              }}>
                Productos íntimos de alta calidad, entregados con total discreción.
                Empaque confidencial, envío rápido a toda Colombia.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/shop">
                  <button className="btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '0.8rem' }}>
                    Ver Catálogo Completo
                  </button>
                </Link>
                <Link href="/shop?category=Lencer%C3%ADa">
                  <button className="btn-outline" style={{ padding: '0.9rem 2rem' }}>
                    Nueva Lencería
                  </button>
                </Link>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
                {[
                  { icon: '📦', text: 'Envío Discreto' },
                  { icon: '🔒', text: 'Pago Seguro' },
                  { icon: '⚡', text: 'Entrega Rápida' },
                ].map(b => (
                  <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1rem' }}>{b.icon}</span>
                    <span style={{ fontSize: '0.75rem', color: '#555566', fontWeight: 500, letterSpacing: '0.06em' }}>
                      {b.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY CARDS */}
        <section style={{ padding: '5rem 0 3rem' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 className="section-title" style={{ display: 'block', textAlign: 'center' }}>
                Explora por Categoría
              </h2>
              <div style={{ width: 60, height: 1, background: '#c8385a', margin: '1rem auto 0' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', background: '#2a2a3a', borderRadius: 12, overflow: 'hidden' }}>
              {categories.map(cat => {
                const cfg = CATEGORY_CONFIG[cat];
                return (
                  <Link key={cat} href={`/shop?category=${encodeURIComponent(cat)}`}>
                    <div style={{
                      background: '#111118', padding: '2.5rem 2rem',
                      textAlign: 'center', cursor: 'pointer',
                      transition: 'background 0.3s',
                      height: '100%',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = '#16161f'}
                      onMouseLeave={e => e.currentTarget.style.background = '#111118'}
                    >
                      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{cfg.emoji}</div>
                      <h3 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '1.25rem', fontWeight: 400, color: '#f5f0ee',
                        marginBottom: '0.5rem',
                      }}>{cat}</h3>
                      <p style={{ fontSize: '0.92rem', color: '#555566' }}>{cfg.desc}</p>
                      <div style={{
                        width: 30, height: 1, background: cfg.color,
                        margin: '1rem auto 0',
                      }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* PRODUCT SECTIONS — one per category */}
        {categories.map((cat, idx) => {
          const catProducts = getProductsByCategory(cat).slice(0, 4);
          const cfg = CATEGORY_CONFIG[cat];
          return (
            <section key={cat} style={{
              padding: '4rem 0',
              background: idx % 2 === 1 ? '#0d0d14' : 'transparent',
            }}>
              <div className="container">
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-end', marginBottom: '2.5rem',
                  flexWrap: 'wrap', gap: '1rem',
                }}>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{
                      fontSize: '0.68rem', letterSpacing: '0.25em',
                      textTransform: 'uppercase', color: cfg.color,
                      marginBottom: '0.5rem', fontWeight: 600,
                    }}>
                      {cfg.emoji} Categoría
                    </p>
                    <h2 className="section-title">{cat}</h2>
                  </div>
                  <Link href={`/shop?category=${encodeURIComponent(cat)}`}>
                    <button className="btn-outline" style={{ fontSize: '0.72rem', padding: '0.6rem 1.5rem' }}>
                      Ver Todo →
                    </button>
                  </Link>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '1.5rem',
                }}>
                  {catProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* DELIVERY BANNER */}
        <section style={{ padding: '2rem 0' }}>
          <div className="container">
            <div style={{
              background: 'linear-gradient(135deg, #1a0a12 0%, #16161f 100%)',
              border: '1px solid #c8385a44',
              borderRadius: 12,
              padding: '3rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}>
              <div>
                <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: '#c8385a', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Envío Express
                </p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300, color: '#f5f0ee', marginBottom: '0.5rem' }}>
                  Entrega en 24–48 horas
                </h2>
                <p style={{ color: '#555566', fontSize: '0.85rem' }}>
                  Envíos a todo Colombia · Empaque 100% discreto y confidencial
                </p>
              </div>
              <Link href="/shop">
                <button className="btn-gold" style={{ padding: '0.9rem 2.5rem', whiteSpace: 'nowrap' }}>
                  Comprar Ahora
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
