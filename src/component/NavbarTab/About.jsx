// src/components/About.jsx
import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <h1>About FarmMate</h1>
      <p className="about-intro">
        <strong>FarmMate</strong> is a platform designed to connect farmers directly with customers, cutting out the middlemen and empowering rural communities.
      </p>

      <div className="about-section">
        <h2>🌾 Our Mission</h2>
        <p>
          We aim to build a sustainable digital bridge between local farmers and consumers. Our mission is to support agriculture by giving farmers the tools they need to succeed in today's digital world.
        </p>
      </div>

      <div className="about-section">
        <h2>🚜 What We Offer</h2>
        <ul>
          <li>🛒 Online marketplace for fresh farm produce</li>
          <li>📞 Direct communication between buyers and sellers</li>
          <li>🖼️ Product image uploads with harvest details</li>
          <li>📍 Location-based product listings</li>
        </ul>
      </div>

      <div className="about-section">
        <h2>🌍 Why FarmMate?</h2>
        <p>
          We believe every farmer deserves access to modern selling tools and every consumer deserves access to fresh, trustworthy food. Together, we are making that happen.
        </p>
      </div>
    </div>
  );
};

export default About;
