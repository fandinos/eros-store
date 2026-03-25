// pages/_app.js
import '../styles/globals.css';
import { CartProvider } from '../lib/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <div className="dots-bg" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </div>
      </div>
    </CartProvider>
  );
}
