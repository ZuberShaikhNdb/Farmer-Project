import { useState } from "react";
import "./Login-SingUp.css"
import { useNavigate } from "react-router-dom"; 
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { Link } from "react-router-dom";


const SingUp = () =>{
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/home");// Redirect to Home Page
      };
    
      const handleSignUp = () => {
        navigate("/home"); // Redirect to Home Page
      };


    return(
        <div className="Login-body">
        <div className="container">
            <div className="form-container">
                <div className="form-toggle">
                    <button className={isLogin ? 'active' : ""} onClick={()=> setIsLogin(true)}>Login</button>
                    <button className={!isLogin ? 'active' : ""}onClick={()=> setIsLogin(false)}>SignUP</button>

                </div>
                {isLogin ? <>
                    <div className="form">
                        <h2>Login Form</h2>
                        <input type="email" placeholder="E-mail"/>
                        <input type="password" placeholder="Password"/>
                        <a href='#'>Forgot Password</a>
                        <button onClick={handleLogin}>Login</button>
                        <p>Not a Member ? <a href='#' onClick={()=> setIsLogin(false)}>SignUp Now</a></p>
                    </div>
                </> : 
                <>
                    <div className="form">
                    <h2>SignUP Form</h2>
                    <input type="email" placeholder="E-mail"/>
                    <input type="password" placeholder="Password"/>
                    <input type="password" placeholder="Confirm Password" />
                    <button onClick={handleSignUp}>SignUP</button>
                    </div>
                </>}
            </div>
        </div>
        </div>
    );
}

export default SingUp;