import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import config from '../config';
import './Products.css';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
  const [selectedWeights, setSelectedWeights] = useState({});
  const { cart, addToCart, updateQuantity, clearCart, getCartCount, isInCart, getCartQuantity } = useCart();
  const location = useLocation();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (location.state?.openCheckout && getCartCount() > 0) {
      setShowCheckout(true);
      // Clear the state after opening checkout
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/products`);
      if (response.data.success) {
        setAllProducts(response.data.products);
        const uniqueCategories = ['All', ...new Set(response.data.products.map(p => p.category))];
        setCategories(uniqueCategories);
      } else if (Array.isArray(response.data)) {
        setAllProducts(response.data);
        const uniqueCategories = ['All', ...new Set(response.data.map(p => p.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Backend server not running. Please start your backend server on port 3000.');
    } finally {
      setLoading(false);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    accessibility: false,
    focusOnSelect: false,
  };

  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartItems = Object.values(cart).map(item => {
    const product = allProducts.find(p => p.id === item.productId);
    if (!product) return null;
    const price = product.prices?.[item.weight] || product.price || 0;
    return { ...product, quantity: item.quantity, selectedWeight: item.weight, selectedPrice: price };
  }).filter(item => item !== null);

  const total = cartItems.reduce((sum, item) => sum + (item.selectedPrice * item.quantity), 0);

  const handleCheckout = () => {
    const orderDetails = cartItems.map(item => 
      `${item.name} (${item.selectedWeight}) x ${item.quantity} = ₹${item.selectedPrice * item.quantity}`
    ).join('%0A');

    const message = `*New Order from CM Super Mart*%0A%0A*Customer Details:*%0AName: ${formData.name}%0APhone: ${formData.phone}%0AEmail: ${formData.email}%0AAddress: ${formData.address}%0A%0A*Order Details:*%0A${orderDetails}%0A%0A*Total: ₹${total}*`;

    const whatsappNumber = '919100009907';
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    
    clearCart();
    setShowCheckout(false);
    setFormData({ name: '', phone: '', email: '', address: '' });
  };

  return (
    <div className="products-page">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {getCartCount() > 0 && (
          <button className="checkout-btn-top" onClick={() => setShowCheckout(true)}>
            Checkout ({getCartCount()} items)
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
          </div>
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="products-container">
          <aside className="categories-sidebar">
            <h3>Categories</h3>
            <ul>
              {categories.map(category => (
                <li
                  key={category}
                  className={selectedCategory === category ? 'active' : ''}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </aside>

          <div className="products-list">
            {filteredProducts.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#666' }}>
                No products available
              </div>
            ) : (
              filteredProducts.map((product, idx) => {
                const defaultWeight = Array.isArray(product.grams) ? product.grams[0] : product.grams;
                const currentWeight = selectedWeights[product.id] !== undefined ? selectedWeights[product.id] : defaultWeight;
                const currentPrice = product.prices?.[currentWeight] || product.price || 0;
                const badges = ['bestseller', 'popular', 'new', 'offer'];
                const badge = badges[idx % 4];
                const badgeLabels = { bestseller: '🔥 Best Seller', popular: '⭐ Popular', new: '🆕 New', offer: '💰 Offer' };
                
                return (
                <div key={product.id} className="product-item">
                  <div className="product-image-container">
                    <span className={`product-badge ${badge}`}>{badgeLabels[badge]}</span>
                    <img src={product.images[0]} alt={product.name} onClick={() => setSelectedProduct(product)} />
                    <div className="quick-view-overlay">
                      <button className="quick-view-btn" onClick={() => setSelectedProduct(product)}>Quick View</button>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="product-rating">
                      <span>4.5</span>
                    </div>
                    <div className="product-tags">
                      <span className="product-tag">✨ Fresh Today</span>
                    </div>
                    <p>{product.description || ''}</p>
                    <div className="product-details">
                      <select 
                        className="grams-dropdown"
                        value={currentWeight}
                        onChange={(e) => {
                          const newWeight = e.target.value;
                          setSelectedWeights({...selectedWeights, [product.id]: newWeight});
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {Array.isArray(product.grams) ? product.grams.map((gram, idx) => (
                          <option key={idx} value={gram}>{gram}</option>
                        )) : <option value={product.grams}>{product.grams}</option>}
                      </select>
                      <div className="price-section">
                        <span className="price">₹{currentPrice}</span>
                      </div>
                    </div>
                    {!isInCart(product.id, currentWeight) ? (
                      <button className="add-to-cart" onClick={() => addToCart(product.id, currentWeight)}>
                        Add to Cart
                      </button>
                    ) : (
                      <div className="quantity-control">
                        <button onClick={() => updateQuantity(product.id, currentWeight, -1)}>-</button>
                        <span>{getCartQuantity(product.id, currentWeight)}</span>
                        <button onClick={() => updateQuantity(product.id, currentWeight, 1)}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              )
            )}
          </div>
        </div>
      )}

      {showCheckout && (
        <div className="modal-overlay" onClick={() => setShowCheckout(false)}>
          <div className="modal-content checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCheckout(false)}>&times;</button>
            <h2>Order Summary</h2>
            <div className="delivery-info">Free & Fast Delivery</div>
            <div className="checkout-items">
              {cartItems.map(item => (
                <div key={item.id} className="checkout-item">
                  <img src={item.images[0]} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>{item.selectedWeight} x {item.quantity} = ₹{item.selectedPrice * item.quantity}</p>
                  </div>
                </div>
              ))}
              <div className="checkout-total">Total: ₹{total}</div>
            </div>
            <div className="checkout-form">
              <input type="text" placeholder="Name *" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input type="tel" placeholder="Phone *" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              <input type="email" placeholder="Email *" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <textarea placeholder="Address *" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              <button className="whatsapp-btn" onClick={handleCheckout} disabled={!formData.name || !formData.phone || !formData.email || !formData.address}>
                Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (() => {
        const defaultWeight = Array.isArray(selectedProduct.grams) ? selectedProduct.grams[0] : selectedProduct.grams;
        const modalWeight = selectedWeights[`modal-${selectedProduct.id}`] !== undefined ? selectedWeights[`modal-${selectedProduct.id}`] : defaultWeight;
        const modalPrice = selectedProduct.prices?.[modalWeight] || selectedProduct.price || 0;
        
        return (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>&times;</button>
            <Slider {...sliderSettings} className="modal-slider">
              {selectedProduct.images.map((img, index) => (
                <div key={index}>
                  <img src={img} alt={`${selectedProduct.name} ${index + 1}`} />
                </div>
              ))}
            </Slider>
            <h2>{selectedProduct.name}</h2>
            <p className="description">{selectedProduct.description}</p>
            <div className="product-details">
              <select 
                className="grams-dropdown"
                value={modalWeight}
                onChange={(e) => {
                  const newWeight = e.target.value;
                  setSelectedWeights({...selectedWeights, [`modal-${selectedProduct.id}`]: newWeight});
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {Array.isArray(selectedProduct.grams) ? selectedProduct.grams.map((gram, idx) => (
                  <option key={idx} value={gram}>{gram}</option>
                )) : <option value={selectedProduct.grams}>{selectedProduct.grams}</option>}
              </select>
              <span className="price">₹{modalPrice}</span>
            </div>
            {!isInCart(selectedProduct.id, modalWeight) ? (
              <button className="add-to-cart" onClick={() => addToCart(selectedProduct.id, modalWeight)}>
                Add to Cart
              </button>
            ) : (
              <div className="quantity-control">
                <button onClick={() => updateQuantity(selectedProduct.id, modalWeight, -1)}>-</button>
                <span>{getCartQuantity(selectedProduct.id, modalWeight)}</span>
                <button onClick={() => updateQuantity(selectedProduct.id, modalWeight, 1)}>+</button>
              </div>
            )}
          </div>
        </div>
        );
      })()}
    </div>
  );
};

export default Products;
