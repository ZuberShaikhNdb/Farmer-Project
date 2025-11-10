import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;
  const cartItems = location.state?.cartItems || [];

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  if (!product && cartItems.length === 0) {
    return (
      <div className="checkout-error">
        <h2>No items selected</h2>
        <button onClick={() => navigate("/buy")}>Back to Products</button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        navigate("/");
        return;
      }

      // Prepare order data
      let orderData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      };

      // Add items to order
      if (cartItems.length > 0) {
        orderData.items = cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }));
      } else if (product) {
        orderData.items = [{
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        }];
      }

      console.log("Sending order data:", orderData);

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setOrderId(data.orderId || data._id || "ORD-" + Date.now());
        setOrderSuccess(true);
        localStorage.removeItem('cart');
      } else {
        setError(data.error || "Failed to place order");
        console.error("Error response:", data);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    if (cartItems.length > 0) {
      return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    }
    return product?.price || 0;
  };

  // Order Success Screen
  if (orderSuccess) {
    return (
      <div className="order-success-container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p className="order-id">Order ID: <strong>{orderId}</strong></p>
          
          <div className="success-details">
            <h4>Order Details</h4>
            <p><strong>Name:</strong> {formData.fullName}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Phone:</strong> {formData.phone}</p>
            <p><strong>Delivery Address:</strong> {formData.address}, {formData.city}, {formData.state} - {formData.pincode}</p>
            <p><strong>Total Amount:</strong> ₹{getTotalPrice()}</p>
          </div>

          <div className="success-message">
            <p>Your order has been confirmed! You will receive a confirmation email shortly.</p>
            <p>Track your order using Order ID: <strong>{orderId}</strong></p>
          </div>

          <div className="success-buttons">
            <button 
              className="btn-home"
              onClick={() => navigate("/home")}
            >
              Back to Home
            </button>
            <button 
              className="btn-orders"
              onClick={() => navigate("/profile")}
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        <div className="checkout-form">
          <h2>Checkout</h2>
          
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label>Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your full address"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="City"
                />
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="State"
                />
              </div>

              <div className="form-group">
                <label>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  placeholder="Pincode"
                />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div className="summary-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p className="product-name">{item.name}</p>
                    <p className="product-price">₹{item.price}</p>
                    <p className="product-quantity">Qty: {item.quantity}</p>
                  </div>
                  <p className="item-subtotal">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))
            ) : product ? (
              <div className="summary-item">
                <img src={product.image} alt={product.name} />
                <div>
                  <p className="product-name">{product.name}</p>
                  <p className="product-price">₹{product.price}</p>
                  <p className="product-quantity">Qty: 1</p>
                </div>
              </div>
            ) : null}
          </div>
          <div className="summary-total">
            <h4>Total: ₹{getTotalPrice()}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;