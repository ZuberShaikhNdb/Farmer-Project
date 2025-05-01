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
    inStock: true,
    contact: {
      email: "",
      phone: "",
    },
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "email" || name === "phone") {
      setForm({
        ...form,
        contact: {
          ...form.contact,
          [name]: value,
        },
      });
    } else {
      setForm({
        ...form,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("quantity", form.quantity);
    formData.append("description", form.description);
    formData.append("location", form.location);
    formData.append("category", form.category);
    formData.append("harvestDate", form.harvestDate);
    formData.append("inStock", form.inStock);
    formData.append("contactEmail", form.contact.email); // Separate contact fields
    formData.append("contactPhone", form.contact.phone); // Separate contact fields

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch("http://localhost:5000/api/products/add", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSuccess(true);
        setForm({
          name: "",
          price: "",
          quantity: "",
          description: "",
          location: "",
          category: "",
          harvestDate: "",
          inStock: true,
          contact: {
            email: "",
            phone: "",
          },
        });
        setImage(null);
        setPreview(null);
        setTimeout(() => setSuccess(false), 4000);
      } else {
        alert("Failed to submit. Try again.");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  return (
    <div className="sell-container">
      <h2>List Your Product</h2>

      {success && <div className="success-message">🎉 Product listed successfully!</div>}

      <form onSubmit={handleSubmit} className="sell-form">
        <label>Product Name:</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="e.g. Tomatoes"
        />

        <label>Price (₹):</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
          placeholder="e.g. 120"
        />

        <label>Quantity (in Kg or Units):</label>
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          required
          placeholder="e.g. 15"
        />
        <small>Unit is Kg or count, mention in description.</small>

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
        <input
          type="date"
          name="harvestDate"
          value={form.harvestDate}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          required
          placeholder="Describe your product..."
        />

        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          required
          placeholder="e.g. Indore, MP"
        />

        <label>Contact Email:</label>
        <input
          type="email"
          name="email"
          value={form.contact.email}
          onChange={handleChange}
          required
          placeholder="e.g. farmer@example.com"
        />

        <label>Contact Phone:</label>
        <input
          type="tel"
          name="phone"
          value={form.contact.phone}
          onChange={handleChange}
          required
          placeholder="e.g. 9876543210"
        />

        <label>
          <input
            type="checkbox"
            name="inStock"
            checked={form.inStock}
            onChange={handleChange}
          />
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
