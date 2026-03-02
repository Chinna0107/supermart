import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
  const { cart, updateQuantity, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      if (response.data.success) {
        setAllProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const cartItems = Object.keys(cart).map(id => {
    const product = allProducts.find(p => p.id === parseInt(id));
    return product ? { ...product, quantity: cart[id] } : null;
  }).filter(item => item !== null);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = () => {
    const orderDetails = cartItems.map(item => 
      `${item.name} (${item.grams}) x ${item.quantity} = ₹${item.price * item.quantity}`
    ).join('%0A');

    const message = `*New Order from CM Super Mart*%0A%0A*Customer Details:*%0AName: ${formData.name}%0APhone: ${formData.phone}%0AEmail: ${formData.email}%0AAddress: ${formData.address}%0A%0A*Order Details:*%0A${orderDetails}%0A%0A*Total: ₹${total}*`;

    const whatsappNumber = '919876543210'; // Replace with your WhatsApp number
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    
    clearCart();
  };

  const isFormValid = formData.name && formData.phone && formData.email && formData.address;

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p><Link to="/products">Continue Shopping</Link></p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-container">
        <div className="cart-items">
          <h2>Your Cart</h2>
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.images[0]} alt={item.name} />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>{item.grams}</p>
                <div className="cart-item-price">
                  <span>₹{item.price}</span>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                  <strong>₹{item.price * item.quantity}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="checkout-form">
          <h2>Delivery Details</h2>
          <div className="form-group">
            <label>Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Address *</label>
            <textarea name="address" value={formData.address} onChange={handleInputChange} required />
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div>
              <span>Subtotal:</span>
              <span>₹{total}</span>
            </div>
            <div className="total">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
          </div>

          <button className="checkout-btn" onClick={handleCheckout} disabled={!isFormValid}>
            Place Order via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
