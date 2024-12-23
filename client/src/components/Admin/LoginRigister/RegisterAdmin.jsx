import React, { useState } from "react";
import "./RegisterAdmin.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const admins = {
    adminName: "",
    adminId: "",
    email: "",
    pass: ""
  };
  const [admin, setAdmin] = useState(admins);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admin.email || !admin.pass || !admin.adminId || !admin.adminName) {
      setError("Please fill out all fields");
      return;
    }
    await axios
      .post(`http://localhost:8000/admin/addAdmin`, admin)
      .then((response) => {
        toast.success(response.data.msg, { position: "top-right" });
        navigate("/getAll");
      })
      .catch(() => {
        toast.error("Admin ID or Email already registered. Go to login.", {
          position: "top-right"
        });
      });
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h1>Area HUB</h1>
        <p>Create your admin account and join the community!</p>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <label>Name:</label>
            <input
              type="text"
              value={admin.adminName}
              onChange={inputHandler}
              placeholder="Enter your Name"
              name="adminName"
            />
          </div>
          <div className="input-group">
            <label>Admin ID:</label>
            <input
              type="text"
              value={admin.adminId}
              onChange={inputHandler}
              placeholder="Enter your Admin ID"
              name="adminId"
            />
          </div>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={admin.email}
              onChange={inputHandler}
              placeholder="Enter your Email"
              name="email"
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={admin.pass}
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
          <Link to={"/loginAdmin"}>&larr; Back to Login</Link>
          <br></br>
          <Link to={"/registerUser"}>&rarr; Register as User</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
