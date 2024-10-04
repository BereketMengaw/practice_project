import React from "react";
import "./Header.css";

function Header() {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>
          Order your <br /> favourite food here
        </h2>
        <p>
          Craving fresh, juicy tomatoes? Look no further! Tomato Food Delivery
          brings the best of the farm straight to your door. Enjoy the
          convenience of home-delivered tomatoes, perfect for any meal. Order
          now and taste the difference!
        </p>

        <button>View Menu</button>
      </div>
    </div>
  );
}

export default Header;
