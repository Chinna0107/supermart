import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Contact.css';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;
    const whatsappMessage = `Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
    window.open(`https://wa.me/919100009907?text=${whatsappMessage}`, '_blank');
    toast.success('Redirecting to WhatsApp...');
    e.target.reset();
  };

  return (
    <div className="contact-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p className="contact-subtitle">We'd love to hear from you. Get in touch with us!</p>
        
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get in touch</h2>
            
            <div className="info-item">
              <h3>Phone</h3>
              <p>+91 9100009907</p>
              <p>+91 7901288956</p>
            </div>

            <div className="info-item">
              <h3>Email</h3>
              <p>cmsupermart@gmail.com</p>
            </div>

            <div className="info-item">
              <h3>Address</h3>
              <p>CM Mart C/o Sri Mahathi Enterprises<br />
              Rangapuram Main Road<br />
              Sangareddy X Road - 502001</p>
            </div>

            <div className="info-item">
              <h3>Business Hours</h3>
              <p>Monday - Sunday: 8:00 AM - 10:00 PM</p>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <h2>Send us a message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Your Name</label>
                <input name="name" type="text" required />
              </div>
              <div className="form-group">
                <label>Your Email</label>
                <input name="email" type="email" required />
              </div>
              <div className="form-group">
                <label>Your Message</label>
                <textarea name="message" required rows="5"></textarea>
              </div>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
