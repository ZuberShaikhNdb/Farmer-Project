import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");

  const handleSell = () => {
    navigate("/sell");
  };

  const handleBuy = () => {
    navigate("/buy");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="home">
      <div className="home-left">
        <div className="badge">Welcome to FarmMate</div>
        <h1>
          Buy & Sell{" "}
          <span className="highlight">Farm Fresh Products</span>
        </h1>
        <p>
          Connect directly with farmers and buyers. Get fresh produce at the best
          prices.
        </p>

        <div className="button-group">
          <motion.button
            onClick={handleSell}
            className="home-button sell"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🌾 Sell Products
          </motion.button>
          <motion.button
            onClick={handleBuy}
            className="home-button buy"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🛒 Buy Products
          </motion.button>
        </div>
      </div>

      <div className="home-right">
        <motion.div
          className="hero-image"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <img src="/images/farmer image.jpg" alt="Farmer" />
        </motion.div>
        <div className="floating-icons">
          <div className="icon tomato">🍅</div>
          <div className="icon carrot">🥕</div>
          <div className="icon apple">🍎</div>
          <div className="icon wheat">🌾</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
