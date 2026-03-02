import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import Slider from 'react-slick';
import { MdLocalGroceryStore, MdVerified, MdLocalShipping } from 'react-icons/md';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState({});
  const { cart, addToCart, updateQuantity, isInCart, getCartQuantity } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchSliders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      if (response.data.success) {
        setProducts(response.data.products.slice(0, 15));
      } else if (Array.isArray(response.data)) {
        setProducts(response.data.slice(0, 15));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchSliders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/sliders');
      if (response.data.success) {
        setSliders(response.data.sliders);
      } else if (Array.isArray(response.data)) {
        setSliders(response.data);
      }
    } catch (error) {
      console.error('Error fetching sliders:', error);
      // Fallback to default images if API fails
      setSliders([
        { id: 1, imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&h=400&fit=crop', title: 'Grocery Store' },
        { id: 2, imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&fit=crop', title: 'Fresh Products' },
        { id: 3, imageUrl: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=1200&h=400&fit=crop', title: 'Organic Food' }
      ]);
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
      <Slider {...sliderSettings} className="hero-slider">
        {sliders.map(slider => (
          <div key={slider.id} className="slide">
            <img src={slider.imageUrl} alt={slider.title} />
          </div>
        ))}
      </Slider>

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
            <div key={product.id} className="product-card">
              <img src={product.images?.[0] || product.image} alt={product.name} onClick={() => navigate('/products')} />
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
              {!isInCart(product.id, currentWeight) ? (
                <button onClick={() => addToCart(product.id, currentWeight)}>Add to Cart</button>
              ) : (
                <div className="quantity-control">
                  <button onClick={() => updateQuantity(product.id, currentWeight, -1)}>-</button>
                  <span>{getCartQuantity(product.id, currentWeight)}</span>
                  <button onClick={() => updateQuantity(product.id, currentWeight, 1)}>+</button>
                </div>
              )}
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
    </div>
  );
};

export default Home;
