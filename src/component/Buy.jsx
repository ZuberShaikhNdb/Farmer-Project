import React from 'react';
import './Buy.css'; // Import the CSS file

const BuyProducts = () => {
  // Sample product data
  const products = [
    {
      id: 1,
      name: 'Fresh Apples',
      type: 'Fruit',
      price: 2.5,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: 'Organic Tomatoes',
      type: 'Vegetable',
      price: 1.8,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      name: 'Whole Wheat Bread',
      type: 'Grain',
      price: 3.0,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 4,
      name: 'Fresh Milk',
      type: 'Dairy',
      price: 2.0,
      image: 'https://via.placeholder.com/150',
    },
  ];

  const handleBuyNow = (productId) => {
    alert(`You have purchased product with ID: ${productId}`);
    // You can add logic here to handle the purchase (e.g., redirect to a payment page)
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
            <p className="product-price">${product.price.toFixed(2)} per kg</p>
            <button
              className="buy-now-button"
              onClick={() => handleBuyNow(product.id)}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyProducts;