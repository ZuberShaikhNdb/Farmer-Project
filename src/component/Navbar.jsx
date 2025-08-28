import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Navbar.css";
const MotionLi = motion.li;

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/"); // Redirect to login/signup page
  };

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
    { name: "Cart", path: "/cart" },
    { name: "Chatbot", path: "/chatbot" },
  ];

  return (
    <nav className="navbar">
      <motion.div
        className="navbar-brand"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        FarmMate
      </motion.div>

      <ul className="navbar-links">
        {navItems.map((item) => (
          <MotionLi key={item.name} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link to={item.path}>{item.name}</Link>
          </MotionLi>
        ))}

        {isLoggedIn ? (
          <>
            <MotionLi whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link to="/profile">Profile</Link>
            </MotionLi>
            <MotionLi whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </MotionLi>
          </>
        ) : (
          <MotionLi whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link to="/">Login</Link>
          </MotionLi>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
