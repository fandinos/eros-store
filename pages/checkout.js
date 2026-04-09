// pages/checkout.js
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '../lib/CartContext';
import { formatPrice } from '../lib/products';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [widgetReady, setWidgetReady] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const formRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    region: '',
    address: '',
    notes: '',
  });

  const shipping = totalPrice >= 100000 ? 0 : 12000;
  const orderTotal = totalPrice + shipping;

  // Load Wompi widget script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.type = 'text/javascript';
    script.onload = () => setWidgetReady(true);
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValid = form.name && form.email && form.phone && form.city && form.address && form.region;

  const handleCheckout = async () => {
    if (!isValid) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    if (!widgetReady) {
      setError('El widget de pago aún está cargando, intenta de nuevo.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customerInfo: form }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Open Wompi widget
      const checkout = new window.WidgetCheckout({
        currency: 'COP',
        amountInCents: data.amountInCentavos,
        reference: data.reference,
        publicKey: data.publicKey,
        signature: { integrity: data.signature },
        redirectUrl: data.redirectUrl,
        taxInCents: { vat: Math.round(data.amountInCentavos * 0.19) },
        customerData: {
          email: form.email,
          fullName: form.name,
          phoneNumber: form.phone,
          phoneNumberPrefix: '+57',
        },
        shippingAddress: {
          addressLine1: form.address,
          city: form.city,
          region: form.region,
          phoneNumber: form.phone,
          country: 'CO',
        },
      });

      checkout.open(function(result) {
        const transaction = result.transaction;
        if (transaction && transaction.status === 'APPROVED') {
          localStorage.removeItem('toystore-cart');
          clearCart();
          window.location.href = '/success';
        } else {
          setError('El pago no fue aprobado. Por favor intenta de nuevo.');
          setLoading(false);
        }
      });

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main style={{ padding: '6rem 0', textAlign: 'center', minHeight: '60vh' }}>
        <div className="container">
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.25em', color: '#c8385a', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Carrito Vacío
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, marginBottom: '1.5rem' }}>
            Tu carrito está vacío
          </h1>
          <Link href="/shop"><button className="btn-primary">Ver Catálogo</button></Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: '4rem 0', minHeight: '70vh' }}>
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.25em', color: '#c8385a', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
            Finalizar Compra
          </p>
          <h1 className="section-title">Resumen del Pedido</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

          {/* LEFT — Order summary + form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Order items */}
            <div style={{ background: '#16161f', border: '1px solid #2a2a3a', borderRadius: 12, padding: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 300, marginBottom: '1.25rem', color: '#f5f0ee' }}>
                Productos
              </h2>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #2a2a3a' }}>
                  <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #2a2a3a' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: '#f5f0ee' }}>{item.name}</p>
                    <p style={{ color: '#555566', fontSize: '0.78rem' }}>Cant: {item.quantity}</p>
                  </div>
                  <span style={{ color: '#c9a84c', fontWeight: 600, fontSize: '0.9rem' }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#555566' }}>
                  <span>Subtotal</span><span>{formatPrice(totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#555566' }}>
                  <span>Envío</span>
                  <span style={{ color: shipping === 0 ? '#2a9a7a' : undefined }}>
                    {shipping === 0 ? 'GRATIS 🎉' : formatPrice(shipping)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 300, borderTop: '1px solid #2a2a3a', paddingTop: '0.75rem', marginTop: '0.25rem', color: '#c9a84c' }}>
                  <span>Total</span><span>{formatPrice(orderTotal)}</span>
                </div>
              </div>
            </div>

            {/* Shipping form */}
            <div style={{ background: '#16161f', border: '1px solid #2a2a3a', borderRadius: 12, padding: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 300, marginBottom: '1.25rem', color: '#f5f0ee' }}>
                📦 Datos de Envío
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  { label: 'Nombre completo *', name: 'name', type: 'text', placeholder: 'Tu nombre completo' },
                  { label: 'Correo electrónico *', name: 'email', type: 'email', placeholder: 'tu@email.com' },
                  { label: 'Teléfono / WhatsApp *', name: 'phone', type: 'tel', placeholder: '3001234567' },
                  { label: 'Ciudad *', name: 'city', type: 'text', placeholder: 'Bogotá, Medellín, Cali...' },
                  { label: 'Departamento *', name: 'region', type: 'text', placeholder: 'Cundinamarca, Antioquia...' },
                  { label: 'Dirección completa *', name: 'address', type: 'text', placeholder: 'Calle 123 # 45-67, Apto 8' },
                  { label: 'Notas adicionales (opcional)', name: 'notes', type: 'text', placeholder: 'Instrucciones especiales de entrega' },
                ].map(field => (
                  <div key={field.name}>
                    <label style={{ fontSize: '0.72rem', color: '#888899', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      style={{
                        width: '100%',
                        background: '#111118',
                        border: '1px solid #2a2a3a',
                        borderRadius: 6,
                        padding: '0.65rem 0.9rem',
                        color: '#f5f0ee',
                        fontSize: '0.88rem',
                        fontFamily: "'Montserrat', sans-serif",
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#c8385a'}
                      onBlur={e => e.target.style.borderColor = '#2a2a3a'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Payment */}
          <div style={{ background: '#16161f', border: '1px solid #2a2a3a', borderRadius: 12, padding: '1.5rem', alignSelf: 'start' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 300, marginBottom: '0.5rem', color: '#f5f0ee' }}>
              🔒 Pago Seguro
            </h2>
            <p style={{ color: '#555566', fontSize: '0.83rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              El pago se completa aquí mismo en nuestra página a través de Wompi, la pasarela de Bancolombia. No saldrás de nuestro sitio.
            </p>

            <div style={{ background: '#111118', borderRadius: 8, padding: '1rem', border: '1px solid #2a2a3a', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555566', marginBottom: '0.75rem' }}>
                Métodos de pago aceptados
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['💳 Tarjeta', '🏦 PSE', '📱 Nequi', '🏛 Bancolombia', '💵 Efecty'].map(p => (
                  <span key={p} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a3a', borderRadius: 4, padding: '0.3rem 0.7rem', fontSize: '0.75rem', color: '#888899', fontWeight: 500 }}>{p}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {[
                '📦 Empaque 100% discreto',
                '🚚 Envío express 24–48 horas',
                '🔒 Pago procesado por Bancolombia',
                '↩️ Devolución fácil garantizada',
              ].map(g => (
                <p key={g} style={{ fontSize: '0.8rem', color: '#555566' }}>{g}</p>
              ))}
            </div>

            {error && (
              <div style={{ background: 'rgba(200,56,90,0.1)', color: '#e05070', border: '1px solid #c8385a44', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
                ⚠️ {error}
              </div>
            )}

            <button
              className="btn-primary"
              onClick={handleCheckout}
              disabled={loading || !isValid}
              style={{
                width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '0.85rem',
                opacity: loading || !isValid ? 0.6 : 1,
              }}
            >
              {loading ? '⏳ Abriendo pago...' : `Pagar ${formatPrice(orderTotal)}`}
            </button>

            {!isValid && (
              <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#555566', marginTop: '0.5rem' }}>
                Completa los datos de envío para continuar
              </p>
            )}

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link href="/shop" style={{ color: '#555566', fontSize: '0.8rem' }}>← Seguir comprando</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}