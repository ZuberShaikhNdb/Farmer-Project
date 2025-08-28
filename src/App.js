import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './component/Layout';
import SingUp from './component/Login-SingUp';
import Home from './component/Home';
import SellProductForm from './component/Sell';
import BuyProducts from './component/Buy';
import Cart from './component/NavbarTab/Cart';
import About from './component/NavbarTab/About';
import Services from './component/NavbarTab/Services';
import Contact from './component/NavbarTab/Contact';
import ContactSeller from './component/ContactSeller';
import Profile from './component/Profile';
import Chatbot from './component/NavbarTab/Chatbot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SingUp />} />
          <Route path="home" element={<Home />} />
          <Route path="sell" element={<SellProductForm />} />
          <Route path="buy" element={<BuyProducts />} />
          <Route path="cart" element={<Cart />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contact />} />
          <Route path="contactseller" element={<ContactSeller />} />
          <Route path="profile" element={<Profile />} />
          <Route path="chatbot" element={<Chatbot />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
