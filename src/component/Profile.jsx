import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      try {
        // Fetch user profile
        const profileRes = await fetch("http://localhost:5000/api/user/profile", { headers });
        const profileData = await profileRes.json();
        setUser(profileData);

        // Fetch user orders
        const ordersRes = await fetch("http://localhost:5000/api/orders", { headers });
        const ordersData = await ordersRes.json();
        setOrders(ordersData);

        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      {/* User Profile Section */}
      <div className="profile-section">
        <h2>My Profile</h2>
        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>

      {/* Orders Section */}
      <div className="orders-section">
        <h2>My Orders</h2>
        {orders.length === 0 ? (
          <p className="no-orders">No orders yet</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-header">
                  <p><strong>Order ID:</strong> {order._id}</p>
                  <p className={`order-status status-${order.status}`}>{order.status}</p>
                </div>
                <div className="order-details">
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p><strong>Name:</strong> {order.fullName}</p>
                  <p><strong>Address:</strong> {order.address}, {order.city}, {order.state} - {order.pincode}</p>
                  <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                </div>
                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div className="order-item" key={idx}>
                      <span>{item.name}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
