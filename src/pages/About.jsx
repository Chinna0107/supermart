import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About Us</h1>
        <p className="about-subtitle">Your trusted source for quality groceries and daily essentials</p>
        
        <div className="about-content">
          <div className="about-logo">
            <img src="https://res.cloudinary.com/dgyykbmt6/image/upload/v1772460868/cm3_zvfuyu.jpg" alt="CM Mart Logo" />
          </div>
          
          <h2>Our Story</h2>
          <p>Welcome to CM Mart — your neighborhood supermarket where quality meets convenience! Founded with a vision to provide fresh, quality products at affordable prices, CM Mart has become a trusted name in the community.</p>
          <p>We understand the importance of having access to fresh groceries, daily essentials, and household items without compromising on quality. That's why we carefully source our products from trusted suppliers and local farmers to ensure you get the best.</p>
          <p>From fresh fruits and vegetables to pantry staples, dairy products, snacks, beverages, and personal care items — CM Mart is your one-stop shop for all your daily needs.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛒</div>
            <h3>Wide Selection</h3>
            <p>Thousands of products across all categories for your convenience</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h3>Quality Assured</h3>
            <p>Fresh products meeting the highest standards of quality</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Fast Delivery</h3>
            <p>Quick delivery with freshness guaranteed</p>
          </div>
        </div>

        <div className="values-section">
          <h2>Our Vision & Values</h2>
          <p>Our vision is simple — to make every household's shopping experience better by providing quality products, excellent service, and unbeatable value.</p>
          <div className="values-list">
            <div><strong>Quality:</strong> Never compromising on product quality</div>
            <div><strong>Freshness:</strong> Fresh produce delivered daily</div>
            <div><strong>Transparency:</strong> Complete honesty in our practices</div>
            <div><strong>Customer First:</strong> Your satisfaction is our priority</div>
            <div><strong>Community:</strong> Supporting local suppliers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
