// pages/_app.js
import '../styles/globals.css';
import Head from 'next/head';
import { CartProvider } from '../lib/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
 
export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <title>EROS — Tienda Íntima</title>
        <meta name="description" content="Tu tienda íntima de confianza. Envío discreto a toda Colombia." />
      </Head>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </div>
      </div>
    </CartProvider>
  );
}