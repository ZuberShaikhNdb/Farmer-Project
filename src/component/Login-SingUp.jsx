import { useState } from "react";
import "./Login-SingUp.css";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const handleLogin = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json(); // parse response JSON

    if (response.ok) {
      // ✅ Save token to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.user.email); // optional

      // ✅ Navigate to home and reload to update Navbar
      navigate("/home");
      window.location.reload();
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred during login");
  }
};

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      if (response.ok) {
        navigate("/home");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "SignUp failed");
      }
    } catch (error) {
      console.error("SignUp error:", error);
      alert("An error occurred during signup");
    }
  };

  return (
    <div className="Login-body">
      <div className="container">
        <div className="form-container">
          <div className="form-toggle">
            <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>
              Login
            </button>
            <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>
              SignUp
            </button>
          </div>
          {isLogin ? (
            <div className="form">
              <h2>Login Form</h2>
              <input type="email" name="email" placeholder="E-mail" value={email} onChange={handleInputChange} />
              <input type="password" name="password" placeholder="Password" value={password} onChange={handleInputChange} />
              <a href="#">Forgot Password</a>
              <button onClick={handleLogin}>Login</button>
              <p>Not a Member? <button onClick={() => setIsLogin(false)}>SignUp Now</button></p>
            </div>
          ) : (
            <div className="form">
              <h2>SignUp Form</h2>
              <input type="email" name="email" placeholder="E-mail" value={email} onChange={handleInputChange} />
              <input type="password" name="password" placeholder="Password" value={password} onChange={handleInputChange} />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={handleInputChange} />
              <button onClick={handleSignUp}>SignUp</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
