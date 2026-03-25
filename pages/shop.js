// pages/shop.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { products, categories } from '../lib/products';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const router = useRouter();
  const { category: queryCategory } = router.query;
  const [activeCategory, setActiveCategory] = useState(null);
  const [sort, setSort] = useState('default');

  const selectedCategory = activeCategory || queryCategory || null;

  let filtered = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <main style={{ padding: '4rem 0', minHeight: '70vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.25em', color: '#c8385a', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
            Catálogo
          </p>
          <h1 className="section-title">
            {selectedCategory || 'Todos los Productos'}
          </h1>
          <p style={{ color: '#555566', marginTop: '1.5rem', fontSize: '0.85rem' }}>
            {filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
          marginBottom: '2.5rem', alignItems: 'center',
          paddingBottom: '1.5rem', borderBottom: '1px solid #2a2a3a',
        }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={filterBtnStyle(!selectedCategory)}
          >Todos</button>
          {categories.map(cat => (
            <button key={cat}
              onClick={() => setActiveCategory(cat)}
              style={filterBtnStyle(selectedCategory === cat)}
            >{cat}</button>
          ))}

          <div style={{ marginLeft: 'auto' }}>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                background: '#16161f', color: '#f5f0ee',
                border: '1px solid #2a2a3a', borderRadius: 4,
                padding: '0.5rem 1rem', fontSize: '0.78rem',
                fontFamily: "'Montserrat', sans-serif",
                cursor: 'pointer',
              }}
            >
              <option value="default">Ordenar: Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#555566' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem' }}>No hay productos en esta categoría.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}>
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function filterBtnStyle(active) {
  return {
    padding: '0.5rem 1.1rem',
    borderRadius: 4,
    border: `1px solid ${active ? '#c8385a' : '#2a2a3a'}`,
    background: active ? '#c8385a' : 'transparent',
    color: active ? 'white' : '#888899',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.78rem',
    letterSpacing: '0.06em',
    transition: 'all 0.2s',
  };
}
