import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [listed, setListed] = useState([]);
  const [sold, setSold] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
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
        setForm({ name: profileData.name || "", phone: profileData.phone || "" });

        // role-specific fetches (ensure we only set arrays)
        if (profileData.role === "consumer") {
          const purchasesRes = await fetch("http://localhost:5000/api/user/purchases", { headers });
          const purchasesData = await purchasesRes.json();
          setOrders(Array.isArray(purchasesData) ? purchasesData : []);
        }

        if (profileData.role === "farmer") {
          const listedRes = await fetch("http://localhost:5000/api/user/listed", { headers });
          const listedData = await listedRes.json();
          setListed(Array.isArray(listedData) ? listedData : []);

          const soldRes = await fetch("http://localhost:5000/api/user/sold", { headers });
          const soldData = await soldRes.json();
          setSold(Array.isArray(soldData) ? soldData : []);
        }

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
          {!editing ? (
            <>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <button onClick={() => setEditing(true)}>Edit Profile</button>
            </>
          ) : (
            <div className="edit-form">
              <label>Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <label>Phone</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              <div className="edit-actions">
                <button onClick={async () => {
                  const token = localStorage.getItem('token');
                  try {
                    const res = await fetch('http://localhost:5000/api/user/profile', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify(form)
                    });
                    if (res.ok) {
                      const data = await res.json();
                      setUser(prev => ({ ...prev, name: data.profile.name, phone: data.profile.phone }));
                      setEditing(false);
                      alert('Profile updated');
                    } else {
                      const err = await res.json();
                      alert(err.message || 'Update failed');
                    }
                  } catch (err) {
                    console.error(err);
                    alert('Update failed');
                  }
                }}>Save</button>
                <button onClick={() => { setEditing(false); setForm({ name: user.name || '', phone: user.phone || '' }); }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders Section */}
      {user.role === 'consumer' && (
        <div className="orders-section">
          <h2>My Purchases</h2>
          {orders.length === 0 ? (
            <p className="no-orders">No purchases yet</p>
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
      )}

      {user.role === 'farmer' && (
        <>
          <div className="listed-section">
            <h2>My Listed Products</h2>
            {listed.length === 0 ? (
              <p>No products listed</p>
            ) : (
              <div className="product-list">
                {listed.map(p => (
                  <div className="product-card" key={p._id}>
                    <img src={`http://localhost:5000/uploads/${p.image}`} alt={p.name} />
                    <div>
                      <h4>{p.name}</h4>
                      <p>₹{p.price}</p>
                      <p>{p.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sold-section">
            <h2>Products Sold</h2>
            {sold.length === 0 ? (
              <p>No sales yet</p>
            ) : (
              <div className="orders-list">
                {sold.map(order => (
                  <div className="order-card" key={order._id}>
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Buyer:</strong> {order.consumer?.email || '—'}</p>
                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <div className="order-items">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="order-item">
                          <span>{it.name}</span>
                          <span>Qty: {it.quantity}</span>
                          <span>₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
