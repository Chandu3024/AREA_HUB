// components/Header.js
import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">AreaExplorer</div>
      <input
        type="text"
        placeholder="Search for areas, cities, landmarks..."
        className="search-bar"
      />
      <div className="nav-links">
        <button>My Account</button>
        <button>Favorites</button>
        <button>Cart</button>
      </div>
    </header>
  );
};

export default Header;
