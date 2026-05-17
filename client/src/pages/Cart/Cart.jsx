import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    food_list,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    setCartItems,
    url,
    currency,
    deliveryCharge,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const removeItemCompletely = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p>{" "}
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item.id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  {item.image && (
                    <img
                      src={`${url}/${item.image.replace(/^\/+/, "")}`}
                      alt={item.title}
                      className="cart-item-image"
                    />
                  )}
                  <p>{item.title}</p>
                  <p>
                    {currency}
                    {item.price}
                  </p>
                  <div className="quantity-controls">
                    <button onClick={() => removeFromCart(item.id)}>-</button>
                    <span>{cartItems[item.id]}</span>
                    <button onClick={() => addToCart(item.id)}>+</button>
                  </div>
                  <p>
                    {currency}
                    {(item.price * cartItems[item.id]).toFixed(2)}
                  </p>
                  <button
                    className="cart-items-remove-button"
                    onClick={() => removeItemCompletely(item.id)}
                  >
                    Remove
                  </button>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>
                {currency}
                {getTotalCartAmount().toFixed(2)}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>
                {currency}
                {getTotalCartAmount() === 0
                  ? "0.00"
                  : deliveryCharge.toFixed(2)}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                {currency}
                {(getTotalCartAmount() === 0
                  ? 0
                  : getTotalCartAmount() + deliveryCharge
                ).toFixed(2)}
              </b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
