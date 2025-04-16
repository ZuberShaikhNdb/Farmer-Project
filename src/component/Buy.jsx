import React, { useState, useEffect } from 'react';
import './Buy.css';
import Rating from './Rating';

const statesOfIndia = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const BuyProducts = () => {
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({});
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchProducts();
  }, []);

  const handleContact = (contact) => {
    alert(`Contact the seller at: ${contact}`);
  };

  const handleBuyNow = (productId) => {
    alert(`You have purchased product with ID: ${productId}`);
  };

  const handleAddToCart = (productId) => {
    const product = products.find((p) => p._id === productId);
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingIndex = cart.findIndex((item) => item.id === productId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: `http://localhost:5000/uploads/${product.image}`,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Added ${product.name} to cart`);
  };

  const handleRating = (productId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [productId]: rating,
    }));
  };

  const filteredProducts = selectedState
    ? products.filter((p) => p.location.toLowerCase().includes(selectedState.toLowerCase()))
    : products;

  const toggleExpand = (productId) => {
    setExpandedProductId((prevId) => (prevId === productId ? null : productId));
  };

  return (
    <div className="buy-products">
      <h2>Buy Fresh Products</h2>

      <div className="state-filter">
        <label htmlFor="state">Filter by State: </label>
        <select id="state" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
          <option value="">All States</option>
          {statesOfIndia.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      <div className="product-list">
        {filteredProducts.map((product) => {
          const isExpanded = expandedProductId === product._id;
          return (
            <div
              key={product._id}
              className={`product-card ${isExpanded ? "expanded" : ""}`}
              onClick={() => toggleExpand(product._id)}
            >
              <img
                src={`http://localhost:5000/uploads/${product.image}`}
                alt={product.name}
                className="product-image"
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">₹{product.price} per unit</p>
              <p className="product-location">Location: {product.location}</p>
              <p className="product-stock">
                {product.inStock ? "✅ In Stock" : "❌ Out of Stock"}
              </p>

              {isExpanded && (
                <>
                  <p className="product-type">Category: {product.category}</p>
                  <p className="product-quantity">Quantity: {product.quantity}</p>
                  <p className="product-description">{product.description}</p>
                  <p className="product-harvest">Harvested on: {product.harvestDate}</p>

                  <Rating
                    rating={ratings[product._id] || 0}
                    setRating={(rating) => handleRating(product._id, rating)}
                  />

                  <div className="button-group">
                    <button onClick={(e) => { e.stopPropagation(); handleContact(product.contact); }} className="contact-button">
                      Contact
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product._id); }} className="cart-button">
                      Add to Cart
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleBuyNow(product._id); }} className="buy-now-button">
                      Buy Now
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BuyProducts;
