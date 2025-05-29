import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from './Footer';
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

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
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <>
      <div className="home">
        <div className="home-left">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.span variants={itemVariants} className="badge">
              Fresh from the farm 🌱
            </motion.span>
            <motion.h1 variants={itemVariants}>
              Grow Your Business with <span className="highlight">FarmConnect</span>
            </motion.h1>
            <motion.p variants={itemVariants}>
              The most trusted marketplace connecting farmers directly with buyers. 
              Experience seamless transactions, fair prices, and fresh produce all in one place.
            </motion.p>
            <motion.div variants={itemVariants} className="button-group">
              <button 
                className="home-button sell" 
                onClick={handleSell}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sell Products
              </button>
              <button 
                className="home-button buy" 
                onClick={handleBuy}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Buy Fresh Produce
              </button>
            </motion.div>
          </motion.div>
        </div>

        <div className="home-right">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="/images/farmer image.jpg"
              alt="Happy farmer with fresh produce"
              className="hero-image"
            />
            <div className="floating-icons">
              <div className="icon tomato">🍅</div>
              <div className="icon carrot">🥕</div>
              <div className="icon apple">🍎</div>
              <div className="icon wheat">🌾</div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;