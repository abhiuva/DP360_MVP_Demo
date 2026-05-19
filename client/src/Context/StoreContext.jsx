import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE, API_ROOT } from "../config/api";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = API_ROOT;
  const currency = import.meta.env.VITE_CURRENCY || "£";
  const deliveryCharge = parseFloat(
    import.meta.env.VITE_DELIVERY_CHARGE || "5"
  );
  const tenant_id = import.meta.env.VITE_TENANT_ID;

  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // ✅ Load cartItems from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  // ✅ Save cartItems to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        const decoded = JSON.parse(atob(savedToken.split(".")[1]));
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem("token");
          setToken("");
        } else {
          setToken(savedToken);
        }
      } catch (err) {
        localStorage.removeItem("token");
        setToken("");
      }
    }
  }, []);

  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await axios.get(`${API_BASE}/food/list`);
        if (response.data.success) {
          setFoodList(response.data.data);
        } else {
          console.error("Failed to fetch food list");
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    fetchFoodList();
  }, []);

  const addToCart = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const removeFromCart = (itemId) => {
    if (cartItems[itemId] > 1) {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    } else {
      const updated = { ...cartItems };
      delete updated[itemId];
      setCartItems(updated);
    }
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const item = food_list.find((food) => food.id === parseInt(itemId));
      if (item) {
        total += item.price * cartItems[itemId];
      }
    }
    return total;
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    url,
    token,
    setToken,
    currency,
    deliveryCharge,
    getTotalCartAmount,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
