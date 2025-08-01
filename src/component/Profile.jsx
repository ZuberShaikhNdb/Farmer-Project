import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState({});
  const [listedProducts, setListedProducts] = useState([]);
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const fetchData = async () => {
      try {
        // ✅ Profile info
        const profileRes = await fetch("http://localhost:5000/api/user/profile", { headers });
        const profileData = await profileRes.json();
        setUser(profileData);

        // ✅ Listed products
        const listedRes = await fetch("http://localhost:5000/api/user/listed", { headers });
        const listedData = await listedRes.json();
        setListedProducts(listedData);

        // ✅ Purchased products
        const purchasedRes = await fetch("http://localhost:5000/api/user/purchases", { headers });
        const purchasedData = await purchasedRes.json();
        setPurchasedProducts(purchasedData);

        setLoading(false);
      } catch (err) {
        console.error("Error loading profile:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <div className="profile-container"><p>Loading profile...</p></div>;

  return (
    <div className="profile-container">
      <h2>👤 My Profile</h2>
      <div className="profile-info">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user._id}</p>
        <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="profile-section">
        <h3>📤 Products I Listed to Sell</h3>
        {listedProducts.length === 0 ? (
          <p>No products listed.</p>
        ) : (
          <ul>
            {listedProducts.map((product) => (
              <li key={product._id}>
                <strong>{product.name}</strong> - ₹{product.price} ({product.quantity})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="profile-section">
        <h3>🛒 Products I Purchased</h3>
        {purchasedProducts.length === 0 ? (
          <p>No purchases yet.</p>
        ) : (
          <ul>
            {purchasedProducts.map((product) => (
              <li key={product._id}>
                <strong>{product.name}</strong> - ₹{product.price} ({product.quantity})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;
