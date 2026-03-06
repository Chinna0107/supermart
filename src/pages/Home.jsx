import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import Slider from 'react-slick';
import { MdLocalGroceryStore, MdVerified, MdLocalShipping, MdShoppingCart, MdMessage, MdPhone, MdPayment, MdStar, MdLocalOffer, MdTrendingUp } from 'react-icons/md';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import config from '../config';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState({});
  const [loading, setLoading] = useState(true);
  const [sliderLoaded, setSliderLoaded] = useState(false);
  const { cart, addToCart, updateQuantity, isInCart, getCartQuantity } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchSliders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/products`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchSliders = async () => {
    setSliders([
      { id: 1, imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&h=400&fit=crop', title: 'Grocery Store' },
      { id: 2, imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&fit=crop', title: 'Fresh Products' },
      { id: 3, imageUrl: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=1200&h=400&fit=crop', title: 'Organic Food' }
    ]);
    setSliderLoaded(true);
    setLoading(false);
    
    try {
      const response = await axios.get(`${config.API_URL}/api/sliders`);
      if (response.data.success) {
        setSliders(response.data.sliders);
      } else if (Array.isArray(response.data)) {
        setSliders(response.data);
      }
    } catch (error) {
      console.error('Error fetching sliders:', error);
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

  return (
    <div className="home">
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #4CAF50', borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
            <p style={{ marginTop: '1rem', color: '#666' }}>Loading...</p>
          </div>
        </div>
      ) : (
        <>
          <Slider {...sliderSettings} className="hero-slider">
            {sliders.map(slider => (
              <div key={slider.id} className="slide">
                <img src={slider.imageUrl} alt={slider.title} />
              </div>
            ))}
          </Slider>

          {sliderLoaded && (
            <>
      <section className="special-offers">
        <h2>🔥 Special Offers</h2>
        <div className="offers-grid">
          <div className="offer-card offer-1">
            <div className="offer-badge">30% OFF</div>
            <div className="offer-content">
              <h3>Fresh Vegetables</h3>
              <p>Get 30% off on all fresh vegetables</p>
            </div>
          </div>
          <div className="offer-card offer-2">
            <div className="offer-badge">DEAL</div>
            <div className="offer-content">
              <h3>Fresh Fruits</h3>
              <p>Best prices on seasonal fruits</p>
            </div>
          </div>
          <div className="offer-card offer-3">
            <div className="offer-badge">WEEKEND</div>
            <div className="offer-content">
              <h3>Grocery Combo</h3>
              <p>Special weekend grocery offers</p>
            </div>
          </div>
        </div>
      </section>

      <section className="service-workflow">
        <h2>How Our Service Works</h2>
        <div className="workflow-steps">
          <div className="workflow-card">
            <span className="workflow-number">1</span>
            <MdShoppingCart className="workflow-card-icon" />
            <h3>Browse Products</h3>
            <p>Explore our fresh products and choose what you need.</p>
          </div>
          <div className="workflow-connector" aria-hidden="true">→</div>
          <div className="workflow-card">
            <span className="workflow-number">2</span>
            <MdMessage className="workflow-card-icon" />
            <h3>Send Order</h3>
            <p>Share your selected items on WhatsApp for quick processing.</p>
          </div>
          <div className="workflow-connector" aria-hidden="true">→</div>
          <div className="workflow-card">
            <span className="workflow-number">3</span>
            <MdPhone className="workflow-card-icon" />
            <h3>Confirmation Call</h3>
            <p>Our team calls you to confirm order and delivery details.</p>
          </div>
          <div className="workflow-connector" aria-hidden="true">→</div>
          <div className="workflow-card">
            <span className="workflow-number">4</span>
            <MdPayment className="workflow-card-icon" />
            <h3>Secure Payment</h3>
            <p>Complete payment using your preferred method.</p>
          </div>
          <div className="workflow-connector" aria-hidden="true">→</div>
          <div className="workflow-card">
            <span className="workflow-number">5</span>
            <MdLocalShipping className="workflow-card-icon" />
            <h3>Fast Delivery</h3>
            <p>Your order is packed fresh and delivered to your doorstep.</p>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose Us</h2>
        <div className="features-grid">
          <div className="feature">
            <MdLocalGroceryStore className="feature-icon" />
            <h3>Fresh Daily</h3>
            <p>Fresh items packed every day for better taste and quality.</p>
          </div>
          <div className="feature">
            <MdVerified className="feature-icon" />
            <h3>Quality Assured</h3>
            <p>Trusted quality checks for every product before delivery.</p>
          </div>
          <div className="feature">
            <MdLocalShipping className="feature-icon" />
            <h3>Fast Delivery</h3>
            <p>Quick delivery service so your order reaches on time.</p>
          </div>
          <div className="feature">
            <MdPayment className="feature-icon" />
            <h3>Secure Payments</h3>
            <p>Safe payment options with a smooth and secure checkout.</p>
          </div>
          <div className="feature">
            <MdPhone className="feature-icon" />
            <h3>Friendly Support</h3>
            <p>Friendly support team available on call for order help.</p>
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="section-header">
          <h2>Featured Products</h2>
        </div>
        <div className="products-grid">
          {products.slice(0, 8).map(product => {
            const defaultWeight = Array.isArray(product.grams) ? product.grams[0] : product.grams;
            const currentWeight = selectedWeights[product.id] !== undefined ? selectedWeights[product.id] : defaultWeight;
            const currentPrice = product.prices?.[currentWeight] || product.price || 0;
            
            return (
            <div key={product.id} className="product-card" onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>
              <img src={product.images?.[0] || product.image} alt={product.name} />
              <span className="category">{product.category}</span>
              <h3>{product.name}</h3>
              <div className="rating">
                <MdStar /><MdStar /><MdStar /><MdStar /><MdStar />
                <span>4.5</span>
              </div>
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
                <span className="price">₹{currentPrice}</span>
              </div>
              {isInCart(product.id, currentWeight) ? (
                <div className="quantity-control" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => updateQuantity(product.id, currentWeight, -1)}>-</button>
                  <span>{getCartQuantity(product.id, currentWeight)}</span>
                  <button onClick={() => updateQuantity(product.id, currentWeight, 1)}>+</button>
                </div>
              ) : (
                <button onClick={(e) => { e.stopPropagation(); addToCart(product.id, currentWeight); }}>
                  Add to Cart
                </button>
              )}
            </div>
          )}
          )}
        </div>
        <div className="featured-more-wrap">
          <button className="view-all" onClick={() => navigate('/products')}>Explore all products</button>
        </div>
      </section>

      <section className="testimonials">
        <h2>⭐ What Our Customers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars"><MdStar /><MdStar /><MdStar /><MdStar /><MdStar /></div>
            <p>"Fresh products delivered on time. Best grocery service in town!"</p>
            <div className="customer">
              <div className="customer-avatar">R</div>
              <div>
                <h4>Rajesh Kumar</h4>
                <span>Regular Customer</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars"><MdStar /><MdStar /><MdStar /><MdStar /><MdStar /></div>
            <p>"Quality products at great prices. Highly recommend CM Super Mart!"</p>
            <div className="customer">
              <div className="customer-avatar">P</div>
              <div>
                <h4>Priya Sharma</h4>
                <span>Happy Customer</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars"><MdStar /><MdStar /><MdStar /><MdStar /><MdStar /></div>
            <p>"Excellent service and fresh groceries. Will order again!"</p>
            <div className="customer">
              <div className="customer-avatar">A</div>
              <div>
                <h4>Amit Patel</h4>
                <span>Satisfied Customer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-content">
          <h2>Need Fresh Groceries? 🛒</h2>
          <p>Order Now from CM Super Mart</p>
          <div className="cta-buttons">
            <button className="btn-call" onClick={() => window.location.href='tel:+919876543210'}>📞 Call Now</button>
            <button className="btn-shop" onClick={() => navigate('/products')}>🛍️ Shop Now</button>
          </div>
        </div>
      </section>

            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
