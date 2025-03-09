import React, { useState } from 'react';
import './Buy.css'; // Import the CSS file
import Rating from './Rating'; // Import the Rating component

const BuyProducts = () => {
  // Sample product data
  const products = [
    {
      id: 1,
      name: 'Fresh Apples',
      type: 'Fruit',
      price: 50,
      image: '/images/apples-at-farmers-market-royalty-free-image-1627321463.avif',
    },
    {
      id: 2,
      name: 'Organic Tomatoes',
      type: 'Vegetable',
      price: 60,
      image: '/images/engin-akyurt-HrCatSbULFY-unsplash-scaled.webp',
    },
    {
      id: 3,
      name: 'Whole Wheat Bread',
      type: 'Grain',
      price: 50,
      image: '/images/IMG_2362.jpg',
    },
    {
      id: 4,
      name: 'Fresh Milk',
      type: 'Dairy',
      price: 70,
      image: '/images/product-jpeg.jpeg',
    },
  ];

  const [ratings, setRatings] = useState({});

  const handleBuyNow = (productId) => {
    alert(`You have purchased product with ID: ${productId}`);
    // You can add logic here to handle the purchase (e.g., redirect to a payment page)
  };

  const handleContact = (productId) => {
    alert(`Contact seller for product with ID: ${productId}`);
    // You can add logic here to handle the contact action (e.g., open a contact form)
  };

  const handleAddToCart = (productId) => {
    alert(`Added product with ID: ${productId} to cart`);
    // You can add logic here to handle adding the product to the cart
  };

  const handleRating = (productId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [productId]: rating,
    }));
  };

  return (
    <div className="buy-products">
      <h2>Buy Fresh Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-type">{product.type}</p>
            <p className="product-price">{product.price.toFixed(2)} per kg</p>
            <Rating
              rating={ratings[product.id] || 0}
              setRating={(rating) => handleRating(product.id, rating)}
            />
            <div className="button-group">
              <button
                className="contact-button"
                onClick={() => handleContact(product.id)}
              >
                Contact
              </button>
              <button
                className="cart-button"
                onClick={() => handleAddToCart(product.id)}
              >
                Add to Cart
              </button>
              <button
                className="buy-now-button"
                onClick={() => handleBuyNow(product.id)}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyProducts;