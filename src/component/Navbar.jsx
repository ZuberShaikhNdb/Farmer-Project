import { Link } from "react-router-dom";
import "./Navbar.css"
const Navbar = () => {
    return (
      <nav className="navbar">
        <div className="navbar-brand">FarmMate</div>
        <ul className="navbar-links">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/services">Services</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/cart">Cart</Link>
          </li>
        </ul>
      </nav>
    );
  };
  
  export default Navbar;