import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

function ExploreMenu() {
  return (
    <div className="expolre-menu " id="expolore-menu">
      <h1>Explore our menu</h1>
      <p>Choose one of our delicious menu </p>

      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div key={item} className="explore-menu-item-list">
              <img src={item.menu_image} alt="" />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExploreMenu;
