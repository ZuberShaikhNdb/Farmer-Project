import React, { useState, useEffect } from 'react';
import './Cart.css';

const Cart = () => {
  // Load cart items from localStorage initially
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Handle remove item
  const handleRemove = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart); // Update state
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save to localStorage
  };

  // Handle increase/decrease quantity
  const handleQuantityChange = (id, increment) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        item.quantity += increment;
      }
      return item;
    }).filter(item => item.quantity > 0); // Remove item if quantity is 0
    setCartItems(updatedCart); 
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save to localStorage
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        cartItems.map(item => (
          <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.name} />
            <div className="item-details">
              <h4>{item.name}</h4>
              <p>Price: ₹{item.price}</p>
              <p>Quantity: 
                <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                {item.quantity}
                <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
              </p>
            </div>
            <div className="item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
            <button onClick={() => handleRemove(item.id)} className="remove-btn">Remove</button>
          </div>
        ))
      )}
      <div className="cart-total">
        <h3>Total: ₹{getTotal()}</h3>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
