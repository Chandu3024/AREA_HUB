import React, { useState } from "react";
import "./RegisterAdmin.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const users = {
    userName: "",
    userId: "",
    email: "",
    pass: ""
  };
  const [user, setuser] = useState(users);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setuser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.email || !user.pass || !user.userId || !user.userName) {
      setError("Please fill out all fields");
      return;
    }
    await axios
      .post(`http://localhost:8000/user/addUser`, user)
      .then((response) => {
        const userId = response.data.User._id;
        toast.success(response.data.msg, { position: "top-right" });
        navigate(`/locationForm/${userId}`)
      })
      .catch((error) => {
        toast.error(`user ID or Email already registered. Go to login.${error}`, {
          position: "top-right"
        });
      });
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h1>Area HUB</h1>
        <p>Create your User account and join the community!</p>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <label>Name:</label>
            <input
              type="text"
              value={user.userName}
              onChange={inputHandler}
              placeholder="Enter your Name"
              name="userName"
            />
          </div>
          <div className="input-group">
            <label>user ID:</label>
            <input
              type="text"
              value={user.userId}
              onChange={inputHandler}
              placeholder="Enter your user ID"
              name="userId"
            />
          </div>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={user.email}
              onChange={inputHandler}
              placeholder="Enter your Email"
              name="email"
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={user.pass}
              onChange={inputHandler}
              placeholder="Enter your Password"
              name="pass"
            />
          </div>
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <div className="register-link">
          <Link to={"/"}>&larr; Back to Login</Link>
          <br></br>
          <Link to={"/registerAdmin"}>&larr; Register as Admin</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
