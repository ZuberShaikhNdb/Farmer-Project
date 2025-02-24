import React, { useState } from 'react';
import './Sell.css'; // Import the CSS file

const SellProductFormAttractive = () => {
  const [formData, setFormData] = useState({
    productName: '',
    productType: '',
    quantity: '',
    price: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Product submitted successfully!');
    console.log('Form Data:', formData);
    // You can add logic here to send the form data to an API or backend
  };

  return (
    <div className="sell-product-form-attractive">
      <h2>Sell Your Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
            placeholder=" "
          />
          <label htmlFor="productName">Product Name</label>
        </div>

        <div className="form-group">
          <select
            id="productType"
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            required
          >
            <option value="">Select Product Type</option>
            <option value="vegetable">Vegetable</option>
            <option value="fruit">Fruit</option>
            <option value="grain">Grain</option>
            <option value="dairy">Dairy</option>
          </select>
          <label htmlFor="productType">Product Type</label>
        </div>

        <div className="form-group">
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            placeholder=" "
          />
          <label htmlFor="quantity">Quantity (in kg)</label>
        </div>

        <div className="form-group">
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder=" "
          />
          <label htmlFor="price">Price (per kg)</label>
        </div>

        <div className="form-group">
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            placeholder=" "
          />
          <label htmlFor="description">Description</label>
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SellProductFormAttractive;