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
  const formRef = useRef(null);
  const [paymentMethod, setPaymentMethod] = useState('wompi');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
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

  const isValid = form.name && form.phone && form.address && form.city;

  const handleCheckout = async () => {
    if (!isValid) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    setLoading(true);
    setError(null);

    if (paymentMethod === 'contra_entrega') {
      try {
        const res = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, customerInfo: form, paymentMethod: 'contra_entrega' }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        localStorage.removeItem('toystore-cart');
        clearCart();

        const orderSummary = items.map(i =>
          `${i.quantity}x ${i.name} ($${(i.price * i.quantity).toLocaleString('es-CO')} COP)`
        ).join('\n');
        const total = totalPrice + shipping;

        const msg = encodeURIComponent(
          `🛍️ *NUEVO PEDIDO - All Yours*\n\n` +
          `💳 *Método de pago:* CONTRA ENTREGA\n\n` +
          `👤 *Cliente:* ${form.name}\n` +
          `📱 *Celular:* ${form.phone}\n` +
          `📍 *Ciudad:* ${form.city}\n` +
          `🏠 *Dirección:* ${form.address}\n` +
          `📝 *Notas:* ${form.notes || 'Ninguna'}\n\n` +
          `🛒 *Productos:*\n${orderSummary}\n\n` +
          `💰 *Total:* $${total.toLocaleString('es-CO')} COP\n` +
          `🔖 *Referencia:* ${data.reference}`
        );

        // Open WhatsApp immediately — no success page
        window.location.href = `https://wa.me/573112494003?text=${msg}`;
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
      return;
    }

    // Wompi flow
    if (!widgetReady) {
      setError('El widget de pago aún está cargando, intenta de nuevo.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customerInfo: form, paymentMethod: 'wompi' }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const checkout = new window.WidgetCheckout({
        currency: 'COP',
        amountInCents: data.amountInCentavos,
        reference: data.reference,
        publicKey: data.publicKey,
        signature: { integrity: data.signature },
        redirectUrl: data.redirectUrl,
        taxInCents: { vat: Math.round(data.amountInCentavos * 0.19) },
        customerData: {
          fullName: form.name,
          phoneNumber: form.phone,
          phoneNumberPrefix: '+57',
        },
        shippingAddress: {
          addressLine1: form.address,
          city: form.city,
          phoneNumber: form.phone,
          country: 'CO',
          region: form.city,
        },
      });

      checkout.open(function(result) {
        const transaction = result.transaction;
        if (transaction && transaction.status === 'APPROVED') {
          localStorage.removeItem('toystore-cart');
          clearCart();

          const orderSummary = items.map(i =>
            `${i.quantity}x ${i.name} ($${(i.price * i.quantity).toLocaleString('es-CO')} COP)`
          ).join('\n');
          const total = totalPrice + shipping;

          const msg = encodeURIComponent(
            `🛍️ *NUEVO PEDIDO - All Yours*\n\n` +
            `💳 *Método de pago:* PAGO EN LÍNEA ✅ APROBADO\n` +
            `🔖 *ID Transacción:* ${transaction.id}\n\n` +
            `👤 *Cliente:* ${form.name}\n` +
            `📱 *Celular:* ${form.phone}\n` +
            `📍 *Ciudad:* ${form.city}\n` +
            `🏠 *Dirección:* ${form.address}\n` +
            `📝 *Notas:* ${form.notes || 'Ninguna'}\n\n` +
            `🛒 *Productos:*\n${orderSummary}\n\n` +
            `💰 *Total:* $${total.toLocaleString('es-CO')} COP`
          );
          window.location.href = `/success?method=wompi&msg=${msg}`;
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
                  { label: 'Celular / WhatsApp *', name: 'phone', type: 'tel', placeholder: '3001234567' },
                  { label: 'Dirección completa *', name: 'address', type: 'text', placeholder: 'Calle 123 # 45-67, Apto 8' },
                  { label: 'Ciudad *', name: 'city', type: 'text', placeholder: 'Bogotá, Medellín, Cali...' },
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
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 300, marginBottom: '1.25rem', color: '#f5f0ee' }}>
              💳 Método de Pago
            </h2>

            {/* Payment method selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>

              {/* Wompi option */}
              <div
                onClick={() => setPaymentMethod('wompi')}
                style={{
                  border: `2px solid ${paymentMethod === 'wompi' ? '#c8385a' : '#2a2a3a'}`,
                  borderRadius: 8, padding: '1rem', cursor: 'pointer',
                  background: paymentMethod === 'wompi' ? 'rgba(200,56,90,0.08)' : '#111118',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>💳</span>
                  <span style={{ fontWeight: 700, color: '#f5f0ee', fontSize: '0.9rem' }}>Pago en línea</span>
                  {paymentMethod === 'wompi' && (
                    <span style={{ marginLeft: 'auto', color: '#c8385a', fontSize: '1.1rem' }}>✓</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {['Tarjeta', 'PSE', 'Nequi', 'Bancolombia', 'Efecty'].map(m => (
                    <span key={m} style={{ fontSize: '0.68rem', color: '#888899', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: 4, border: '1px solid #2a2a3a' }}>{m}</span>
                  ))}
                </div>
              </div>

              {/* Contra entrega option */}
              <div
                onClick={() => setPaymentMethod('contra_entrega')}
                style={{
                  border: `2px solid ${paymentMethod === 'contra_entrega' ? '#c9a84c' : '#2a2a3a'}`,
                  borderRadius: 8, padding: '1rem', cursor: 'pointer',
                  background: paymentMethod === 'contra_entrega' ? 'rgba(201,168,76,0.08)' : '#111118',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🤝</span>
                  <span style={{ fontWeight: 700, color: '#f5f0ee', fontSize: '0.9rem' }}>Contra Entrega</span>
                  {paymentMethod === 'contra_entrega' && (
                    <span style={{ marginLeft: 'auto', color: '#c9a84c', fontSize: '1.1rem' }}>✓</span>
                  )}
                </div>
                <p style={{ fontSize: '0.78rem', color: '#555566' }}>
                  Coordina el pago directamente con nosotros al momento de la entrega.
                </p>
              </div>
            </div>

            {/* Info based on payment method */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {paymentMethod === 'wompi' ? (
                <>
                  <p style={{ fontSize: '0.8rem', color: '#555566' }}>📦 Empaque 100% discreto</p>
                  <p style={{ fontSize: '0.8rem', color: '#555566' }}>🚚 Envío express 24–48 horas</p>
                  <p style={{ fontSize: '0.8rem', color: '#555566' }}>🔒 Pago procesado por Bancolombia</p>
                  <p style={{ fontSize: '0.8rem', color: '#555566' }}>↩️ Devolución fácil garantizada</p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '0.8rem', color: '#555566' }}>📦 Empaque 100% discreto</p>
                  <p style={{ fontSize: '0.8rem', color: '#555566' }}>🤝 Coordinaremos el pago contigo</p>
                  <p style={{ fontSize: '0.8rem', color: '#555566' }}>📱 Te contactaremos por WhatsApp</p>
                  <p style={{ fontSize: '0.8rem', color: '#c9a84c', fontWeight: 600 }}>⚠️ El pedido se confirma por WhatsApp</p>
                </>
              )}
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
                background: paymentMethod === 'contra_entrega' ? '#c9a84c' : undefined,
              }}
            >
              {loading
                ? '⏳ Procesando...'
                : paymentMethod === 'contra_entrega'
                ? `Confirmar Pedido ${formatPrice(orderTotal)}`
                : `Pagar ${formatPrice(orderTotal)}`}
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