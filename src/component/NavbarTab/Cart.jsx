import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();

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
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + increment } : item
    ).filter(item => item.quantity > 0); // Remove item if quantity is 0
    setCartItems(updatedCart); 
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save to localStorage
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout", { state: { cartItems } });
  };

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty!</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Price: ₹{item.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                  </div>
                </div>
                <div className="item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
                <button onClick={() => handleRemove(item.id)} className="remove-btn">Remove</button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <h3>Total: ₹{getTotal()}</h3>
            <button onClick={handleCheckout} className="checkout-btn">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
