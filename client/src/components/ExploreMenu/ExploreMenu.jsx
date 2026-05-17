import React, { useContext } from "react";
import "./ExploreMenu.css";
import { StoreContext } from "../../Context/StoreContext";

const ExploreMenu = ({ category, setCategory }) => {
  const { food_list } = useContext(StoreContext);

  const categories = ["All", ...new Set(food_list.map(item => item.category_name))];

  return (
    <div className="explore-menu" id="explore-menu">
      <h2>Explore Our Menu</h2>
      <div className="explore-menu-list">
        {categories.map((cat, index) => (
          <div
            key={index}
            className={`explore-menu-item ${category === cat ? "active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
