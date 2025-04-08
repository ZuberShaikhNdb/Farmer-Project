// src/components/Contact.jsx
import React, { useState } from "react";
import "./Contact.css";
import BackButton from "../BackButton";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });

    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p className="contact-intro">
        Have questions or feedback? We're here to help! Fill out the form below and we'll get back to you soon.
      </p>

      {submitted && <div className="success-message">✅ Message sent successfully!</div>}

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Message:</label>
        <textarea name="message" rows="5" value={formData.message} onChange={handleChange} required />

        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
