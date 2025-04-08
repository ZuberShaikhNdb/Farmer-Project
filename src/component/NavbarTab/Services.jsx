// src/components/Services.jsx
import React from "react";
import "./Services.css";

const Services = () => {
  return (
    <div className="services-container">
      <h1>Our Services</h1>
      <p className="services-intro">
        FarmMate offers a wide range of services to empower farmers and deliver quality produce directly to consumers.
      </p>

      <div className="services-grid">
        <div className="service-card">
          <span className="service-icon">🛒</span>
          <h3>Online Marketplace</h3>
          <p>
            Sell farm-fresh produce directly to customers without middlemen. List your items easily and manage them from your dashboard.
          </p>
        </div>

        <div className="service-card">
          <span className="service-icon">📦</span>
          <h3>Product Management</h3>
          <p>
            Add product photos, descriptions, prices, and availability. Keep everything up to date with a simple interface.
          </p>
        </div>

        <div className="service-card">
          <span className="service-icon">💬</span>
          <h3>Direct Messaging</h3>
          <p>
            Connect with buyers in real-time to answer questions, finalize deals, and build customer trust.
          </p>
        </div>

        <div className="service-card">
          <span className="service-icon">📍</span>
          <h3>Location-Based Listings</h3>
          <p>
            Buyers can see what’s available near them for quicker delivery and fresher produce.
          </p>
        </div>

        <div className="service-card">
          <span className="service-icon">📊</span>
          <h3>Analytics Dashboard</h3>
          <p>
            (Coming Soon!) Track your sales, most-viewed products, and buyer feedback to improve your offerings.
          </p>
        </div>

        <div className="service-card">
          <span className="service-icon">🤝</span>
          <h3>Farmer Support</h3>
          <p>
            We’re here to help with any technical questions or challenges. Reach out anytime to our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;
