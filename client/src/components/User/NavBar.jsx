import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavBar.css";
import logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";

const Navbar = ({userId}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Logout handler
  const logout = () => {
    navigate("/");
  };

  // Input handler for search input
  const inputHandler = (e) => {
    setSearch(e.target.value);
  };

  const handleClick = () => {
    navigate(`/userHome/${userId}`)
  };

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search/${userId}/${search}`);
      window.location.reload();
    }
  };

  return (
    <nav className="navbar custom-navbar">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo and Brand */}
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img src={logo} alt="Logo" className="navbar-logo me-2" />
          <span className="navbar-title">Area Hub</span>
        </a>

        {/* Navigation Links */}
        <ul className="navbar-links d-flex align-items-center list-unstyled mb-0">
          <li className="nav-item">
            <button className="nav-link animated-link" type='button' onClick={handleClick}>
              Home
            </button>
          </li>
        </ul>

        {/* Search Bar and Logout Button */}
        <div className="d-flex align-items-center gap-3">
          <form className="search-form d-flex" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search..."
              value={search}
              onChange={inputHandler}
            />
            <button type="submit" className="btn btn-primary search-btn">
              Search
            </button>
          </form>
          <button onClick={logout} className="btn btn-danger logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;