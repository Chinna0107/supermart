import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { cart, getCartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = getCartCount();
  
  const handleCartClick = (e) => {
    e.preventDefault();
    if (cartCount > 0) {
      navigate('/products', { state: { openCheckout: true } });
    } else {
      navigate('/products');
    }
    setIsMenuOpen(false);
  };
  
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src="/src/assets/logo.jpeg" alt="CM Mart" />
          <span className="brand-name">CM Super Mart</span>
        </Link>
      </div>
      <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path d="M5 7.5H25" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M5 15H25" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M5 22.5H25" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </button>
      <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
        <Link to="/faq" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
        <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
        <Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
        <a href="#" className="cart-icon" onClick={handleCartClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </a>
      </nav>
    </header>
  );
};

export default Header;
