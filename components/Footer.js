// components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#0d0d14', borderTop: '1px solid #2a2a3a', marginTop: '5rem' }}>
      {/* Payment logos bar */}
      <div style={{
        borderBottom: '1px solid #2a2a3a',
        padding: '1.5rem 0',
        background: '#111118',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888899', marginBottom: '1rem' }}>
            Métodos de Pago Aceptados
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Visa */}
            <div style={payBadge}>
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
                <rect width="38" height="24" rx="4" fill="#1A1F71"/>
                <text x="5" y="17" fontFamily="Arial" fontSize="13" fontWeight="bold" fill="white">VISA</text>
              </svg>
            </div>
            {/* Mastercard */}
            <div style={payBadge}>
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
                <rect width="38" height="24" rx="4" fill="#252525"/>
                <circle cx="15" cy="12" r="7" fill="#EB001B"/>
                <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
                <path d="M19 6.8a7 7 0 010 10.4A7 7 0 0119 6.8z" fill="#FF5F00"/>
              </svg>
            </div>
            {/* Amex */}
            <div style={payBadge}>
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
                <rect width="38" height="24" rx="4" fill="#2E77BC"/>
                <text x="3" y="16" fontFamily="Arial" fontSize="8" fontWeight="bold" fill="white">AMEX</text>
              </svg>
            </div>
            {/* PSE */}
            <div style={{ ...payBadge, background: '#003DA5', borderRadius: 4, padding: '3px 8px' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>PSE</span>
            </div>
            {/* Nequi */}
            <div style={{ ...payBadge, background: '#5D0FD8', borderRadius: 4, padding: '3px 8px' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '0.75rem' }}>Nequi</span>
            </div>
            {/* Bancolombia */}
            <div style={{ ...payBadge, background: '#FFCD00', borderRadius: 4, padding: '3px 8px' }}>
              <span style={{ color: '#333', fontWeight: 700, fontSize: '0.68rem' }}>Bancolombia</span>
            </div>
            {/* Efecty */}
            <div style={{ ...payBadge, background: '#FFB300', borderRadius: 4, padding: '3px 8px' }}>
              <span style={{ color: '#333', fontWeight: 700, fontSize: '0.75rem' }}>Efecty</span>
            </div>
            {/* Wompi */}
            <div style={{ ...payBadge, background: '#FF5A5F', borderRadius: 4, padding: '3px 8px' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '0.75rem' }}>Wompi</span>
            </div>
          </div>
          <p style={{ fontSize: '0.68rem', color: '#555566', marginTop: '0.75rem' }}>
            🔒 Todas las transacciones son seguras y encriptadas
          </p>
        </div>
      </div>

      {/* Main footer */}
      <div className="container" style={{ padding: '3rem 1.5rem 1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <img src="/logo.png" alt="All Yours" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
            </div>
            <p style={{ color: '#555566', fontSize: '0.82rem', lineHeight: 1.7 }}>
              Tu tienda íntima de confianza. Discreción total, envíos rápidos en toda Colombia.
            </p>
          </div>

          {/* Categorías */}
          <div>
            <h4 style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888899', marginBottom: '1rem' }}>Categorías</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['Lubricantes', 'Lencería', 'Juegos Sexuales', 'Vibradores y Consoladores'].map(c => (
                <Link key={c} href={`/shop?category=${encodeURIComponent(c)}`} style={{ color: '#555566', fontSize: '0.83rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#f5f0ee'}
                  onMouseLeave={e => e.target.style.color = '#555566'}
                >{c}</Link>
              ))}
            </div>
          </div>

          {/* Ayuda */}
          <div>
            <h4 style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888899', marginBottom: '1rem' }}>Ayuda</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['Envíos y Entregas', 'Devoluciones', 'Preguntas Frecuentes', 'Contáctanos'].map(l => (
                <a key={l} href="#" style={{ color: '#555566', fontSize: '0.83rem' }}>{l}</a>
              ))}
            </div>
          </div>

          {/* Garantías */}
          <div>
            <h4 style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888899', marginBottom: '1rem' }}>Garantías</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: '📦', text: 'Empaque 100% discreto' },
                { icon: '🚚', text: 'Envío express disponible' },
                { icon: '🔒', text: 'Pago 100% seguro' },
                { icon: '↩️', text: 'Devoluciones fáciles' },
              ].map(g => (
                <div key={g.text} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span>{g.icon}</span>
                  <span style={{ color: '#555566', fontSize: '0.82rem' }}>{g.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #2a2a3a', paddingTop: '1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '0.5rem',
        }}>
          <p style={{ color: '#444455', fontSize: '0.78rem' }}>
            © {new Date().getFullYear()} All Yours Sexual Boutique · Solo para mayores de 18 años.
          </p>
          <p style={{ color: '#444455', fontSize: '0.78rem' }}>
            Política de Privacidad · Términos de Uso
          </p>
        </div>
      </div>
    </footer>
  );
}

const payBadge = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
  borderRadius: 4,
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid #2a2a3a',
};