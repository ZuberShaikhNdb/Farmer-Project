import React from 'react';
import './Cart.css';

const Cart = () => {
  const cartItems = [
    {
      id: 1,
      name: 'Fresh Tomatoes',
      price: 2.99,
      quantity: 2,
      image: 'https://source.unsplash.com/100x100/?tomato'
    },
    {
      id: 2,
      name: 'Organic Apples',
      price: 4.99,
      quantity: 1,
      image: 'https://source.unsplash.com/100x100/?apple'
    }
  ];

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      {cartItems.map(item => (
        <div className="cart-item" key={item.id}>
          <img src={item.image} alt={item.name} />
          <div className="item-details">
            <h4>{item.name}</h4>
            <p>Price: ₹{item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
          <div className="item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
        </div>
      ))}
      <div className="cart-total">
        <h3>Total: ₹{getTotal()}</h3>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
