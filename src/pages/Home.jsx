import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import Slider from 'react-slick';
import { MdLocalGroceryStore, MdVerified, MdLocalShipping } from 'react-icons/md';
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
        setProducts(response.data.products.slice(0, 4));
      } else if (Array.isArray(response.data)) {
        setProducts(response.data.slice(0, 4));
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

      <section className="features">
        <div className="feature">
          <MdLocalGroceryStore className="feature-icon" />
          <h3>Fresh Daily</h3>
          <p>Farm to Table. Always Fresh.</p>
          <p>Fresh groceries, fruits, and vegetables delivered daily to ensure maximum freshness.</p>
        </div>
        <div className="feature">
          <MdVerified className="feature-icon" />
          <h3>Quality Assured</h3>
          <p>Our products meet the highest standards of purity and freshness for your family.</p>
        </div>
        <div className="feature">
          <MdLocalShipping className="feature-icon" />
          <h3>Fast Delivery</h3>
          <p>Quick delivery across the city with freshness and quality guaranteed.</p>
        </div>
      </section>

      <section className="featured-products">
        <div className="section-header">
          <h2>Featured Products</h2>
          <button className="view-all" onClick={() => navigate('/products')}>View All</button>
        </div>
        <div className="products-grid">
          {products.map(product => {
            const defaultWeight = Array.isArray(product.grams) ? product.grams[0] : product.grams;
            const currentWeight = selectedWeights[product.id] !== undefined ? selectedWeights[product.id] : defaultWeight;
            const currentPrice = product.prices?.[currentWeight] || product.price || 0;
            
            return (
            <div key={product.id} className="product-card" onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>
              <img src={product.images?.[0] || product.image} alt={product.name} />
              <span className="category">{product.category}</span>
              <h3>{product.name}</h3>
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
              <button onClick={(e) => { e.stopPropagation(); navigate('/products'); }}>View Product</button>
            </div>
          )}
          )}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Experience Pure, Natural Goodness</h2>
          <p>Join thousands of happy customers who trust us for their Natural, Healthy Food Options</p>
          <button className="shop-now" onClick={() => navigate('/products')}>Shop Now</button>
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
