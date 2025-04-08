import React, { useState } from "react";
import "./Sell.css";

const Sell = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    location: "",
    category: "",
    harvestDate: "",
    inStock: true
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...form, image });
    setSuccess(true);

    // Reset form
    setForm({
      name: "",
      price: "",
      quantity: "",
      description: "",
      location: "",
      category: "",
      harvestDate: "",
      inStock: true
    });
    setImage(null);
    setPreview(null);

    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="sell-container">
      <h2>List Your Product</h2>

      {success && <div className="success-message">🎉 Product listed successfully!</div>}

      <form onSubmit={handleSubmit} className="sell-form">
        <label>Product Name:</label>
        <input type="text" name="name" placeholder="e.g. Tomatoes" value={form.name} onChange={handleChange} required />

        <label>Price (₹):</label>
        <input type="number" name="price" placeholder="e.g. 120" value={form.price} onChange={handleChange} required />

        <label>Quantity (in Kg or Units):</label>
        <input type="text" name="quantity" placeholder="e.g. 15 kg" value={form.quantity} onChange={handleChange} required />

        <label>Category:</label>
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Fruits">Fruits</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Grains">Grains</option>
          <option value="Dairy">Dairy</option>
          <option value="Other">Other</option>
        </select>

        <label>Harvest Date:</label>
        <input type="date" name="harvestDate" value={form.harvestDate} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" placeholder="Describe your product..." rows="4" value={form.description} onChange={handleChange} required></textarea>

        <label>Location:</label>
        <input type="text" name="location" placeholder="e.g. Indore, MP" value={form.location} onChange={handleChange} required />

        <label>
          <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} />
          &nbsp; Available in Stock
        </label>

        <label>Upload Product Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && <img src={preview} alt="Preview" className="preview-image" />}

        <button type="submit">List Product</button>
      </form>
    </div>
  );
};

export default Sell;
