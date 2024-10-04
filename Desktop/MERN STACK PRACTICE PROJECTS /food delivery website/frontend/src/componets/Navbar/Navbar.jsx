import React, { useState } from "react";

import "./Navbar.css";
import { assets } from "../../assets/assets";

function Navbar() {
  const [menu, SetMenu] = useState("home");

  return (
    <div className="navbar">
      <img src={assets.logo} alt="" />
      <ul className="navbar-menu">
        <li
          onClick={() => SetMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </li>
        <li
          onClick={() => SetMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </li>
        <li
          onClick={() => SetMenu("mobile")}
          className={menu === "mobile" ? "active" : ""}
        >
          Mobile-App
        </li>
        <li
          onClick={() => SetMenu("contact")}
          className={menu === "contact" ? "active" : ""}
        >
          Contact Us
        </li>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />

        <div className="navbar-basket-icon">
          <img src={assets.basket_icon} alt="" />
          <div className="dot"></div>
        </div>

        <div className="dot">
          <button>sign in </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
