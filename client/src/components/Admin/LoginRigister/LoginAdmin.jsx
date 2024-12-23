import React, { useState } from "react";
import "./LoginAdmin.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:8000/user/getUser/${email},${password}`);
      toast.success(response.data.msg, { position: "top-right" });
      navigate("/getAll");
    } catch (error) {
      console.error(error);
      setError("Invalid email or password. Please try again.");
    }
  };
  

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Area HUB</h1>
        <p>Connect with your community like never before.(Admin)</p>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        <div className="register-link">
          <Link to={"/registerAdmin"}>Don’t have an account? Register &rarr;</Link>
          <br></br>
          <Link to={"/"}>Login as User &rarr;</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
