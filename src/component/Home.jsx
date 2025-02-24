import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import Footer from './Footer';
import "./Home.css"

const Home = ()=>{

    const navigate = useNavigate();

    const handleSell = () => {
        navigate("/sell");// Redirect to Home Page
      };

    const handleBuy = () => {
        navigate("/buy");// Redirect to Home Page
      };

      const handleView = () => {
        navigate("/");// Redirect to Home Page
      };

    return(
        <>
            <Navbar></Navbar>
            
            <div className="home">
            <h1>Welcome to FarmMate</h1>
            <p>Choose an option below:</p>
            <div className="button-container">
            <button onClick={handleSell} className="home-button selling">Sell</button>
            <button onClick={handleBuy} className="home-button buy">Buy</button>
            <button className="home-button view">View</button>
            </div>

          {/*  <div className="image-right">
              <img src={"\images\farmer1.jpg"} alt="1" className="home-image" />
              <img src={"/images/5e7c07a78fb76a9066bbfa410458b849.jpg"} alt="2" className="home-image" />*
            </div>*/}
      
        </div>

            <Footer></Footer>
        </>
    )
}

export default Home;