import { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What products do you offer?",
      answer: "CM Mart offers a wide range of products including groceries, fresh produce, household essentials, personal care items, snacks, beverages, and much more."
    },
    {
      question: "What are your delivery hours?",
      answer: "We deliver from Sunday to Saturday, 9:00 AM to 6:00 PM. Orders placed after business hours will be processed the next day."
    },
    {
      question: "Do you offer home delivery?",
      answer: "Yes! We offer fast and reliable home delivery across our service areas. Simply place your order online or call us."
    },
    {
      question: "How can I place an order?",
      answer: "You can place orders through our website, by calling us at +91 9705947947 or +91 9852357357, or by visiting our store directly."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash on delivery, UPI payments, credit/debit cards, and online bank transfers for your convenience."
    },
    {
      question: "Are your products fresh and quality assured?",
      answer: "Absolutely! We source our products from trusted suppliers and ensure the highest quality standards."
    }
  ];

  return (
    <div className="faq-page">
      <div className="faq-container">
        <h1>Frequently Asked Questions</h1>
        <p className="faq-subtitle">Find answers to common questions about CM Mart</p>
        
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={`faq-question ${openIndex === index ? 'active' : ''}`}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
