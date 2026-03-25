// pages/product/[id].js
import { useState } from 'react';
import Link from 'next/link';
import { getProductById, products, formatPrice } from '../../lib/products';
import { useCart } from '../../lib/CartContext';
import ProductCard from '../../components/ProductCard';

export async function getStaticPaths() {
  return {
    paths: products.map(p => ({ params: { id: p.id } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const product = getProductById(params.id);
  return { props: { product } };
}

export default function ProductPage({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <main style={{ padding: '4rem 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2.5rem', fontSize: '0.75rem', color: '#444455', letterSpacing: '0.06em' }}>
          <Link href="/" style={{ color: '#555566', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#c8385a'}
            onMouseLeave={e => e.target.style.color = '#555566'}
          >Inicio</Link>
          <span style={{ margin: '0 0.5rem' }}>·</span>
          <Link href="/shop" style={{ color: '#555566' }}>Tienda</Link>
          <span style={{ margin: '0 0.5rem' }}>·</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} style={{ color: '#555566' }}>
            {product.category}
          </Link>
          <span style={{ margin: '0 0.5rem' }}>·</span>
          <span style={{ color: '#888899' }}>{product.name}</span>
        </nav>

        {/* Product layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem',
          marginBottom: '5rem',
        }}>
          {/* Image */}
          <div>
            <div style={{
              borderRadius: 12, overflow: 'hidden',
              border: '1px solid #2a2a3a',
              background: '#1a1a26',
              position: 'relative',
            }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', filter: 'brightness(0.9)' }}
              />
              {product.badge && (
                <span className="badge" style={{
                  position: 'absolute', top: 16, left: 16,
                  background: '#c8385a', color: 'white',
                }}>{product.badge}</span>
              )}
            </div>

            {/* Trust signals below image */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem', marginTop: '1rem',
            }}>
              {[
                { icon: '📦', title: 'Envío Discreto', sub: 'Empaque confidencial' },
                { icon: '🔒', title: 'Pago Seguro', sub: 'Encriptado SSL' },
                { icon: '🚚', title: 'Entrega Rápida', sub: '24–48 horas' },
                { icon: '↩️', title: 'Devoluciones', sub: 'Fácil y sin complicaciones' },
              ].map(t => (
                <div key={t.title} style={{
                  background: '#16161f', border: '1px solid #2a2a3a',
                  borderRadius: 8, padding: '0.75rem',
                  display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f5f0ee' }}>{t.title}</p>
                    <p style={{ fontSize: '0.68rem', color: '#555566', marginTop: '0.1rem' }}>{t.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p style={{
              fontSize: '0.68rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: '#c8385a',
              fontWeight: 600, marginBottom: '0.75rem',
            }}>{product.category}</p>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              fontWeight: 300, lineHeight: 1.2,
              color: '#f5f0ee', marginBottom: '1.5rem',
            }}>{product.name}</h1>

            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.2rem', fontWeight: 300,
              color: '#c9a84c', marginBottom: '1.5rem',
            }}>
              {formatPrice(product.price)}
            </div>

            <p style={{
              color: '#888899', lineHeight: 1.75,
              fontSize: '0.9rem', marginBottom: '2rem',
              paddingBottom: '2rem', borderBottom: '1px solid #2a2a3a',
            }}>{product.description}</p>

            {/* Stock badge */}
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '0.78rem', fontWeight: 600,
                color: product.inStock ? '#2a9a7a' : '#c8385a',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: product.inStock ? '#2a9a7a' : '#c8385a',
                  display: 'inline-block',
                }} />
                {product.inStock ? 'En Stock — Listo para enviar' : 'Agotado temporalmente'}
              </span>
            </div>

            {/* Qty selector */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                border: '1px solid #2a2a3a', borderRadius: 4, padding: '0.5rem 1rem',
                background: '#16161f',
              }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ background: 'none', border: 'none', color: '#888899', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 700 }}
                >−</button>
                <span style={{ fontWeight: 600, minWidth: 24, textAlign: 'center', color: '#f5f0ee' }}>{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{ background: 'none', border: 'none', color: '#888899', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 700 }}
                >+</button>
              </div>
              <button
                className="btn-primary"
                onClick={handleAdd}
                disabled={!product.inStock}
                style={{
                  flex: 1, justifyContent: 'center', padding: '0.85rem',
                  background: added ? '#2a6a4a' : undefined,
                  opacity: !product.inStock ? 0.5 : 1,
                }}
              >
                {added ? '✓ Agregado al Carrito' : 'Agregar al Carrito'}
              </button>
            </div>

            {/* Buy now */}
            <Link href="/checkout" onClick={() => { if (!added) addItem(product); }}>
              <button className="btn-gold" style={{ width: '100%', padding: '0.85rem', fontSize: '0.82rem' }}>
                Comprar Ahora
              </button>
            </Link>

            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#444455', marginTop: '1rem' }}>
              🔒 Pago seguro y encriptado · 📦 Empaque 100% discreto
            </p>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: '#c8385a', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
                También te puede gustar
              </p>
              <h2 className="section-title">Productos Relacionados</h2>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
