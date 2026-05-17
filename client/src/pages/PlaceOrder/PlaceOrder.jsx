import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import ReceiptPopup from "../../components/ReceiptPopup";

const PlaceOrder = () => {
  const [payment, setPayment] = useState("pickup");
  const [receipt, setReceipt] = useState(null);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const {
    getTotalCartAmount,
    food_list,
    cartItems,
    url,
    setCartItems,
    currency,
    deliveryCharge,
    token,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const required = ["firstName", "lastName", "email", "phone"];
    const addressFields = ["street", "city", "state", "zipcode", "country"];
    const missing = [...required.filter((f) => !data[f])];

    if (payment === "online") {
      missing.push(...addressFields.filter((f) => !data[f]));
    }

    if (missing.length > 0) {
      toast.error("Please fill all required fields.");
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
    if (!validateFields()) return;

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item.id] > 0) {
        orderItems.push({
          id: item.id,
          name: item.title,
          price: Number(item.price),
          quantity: cartItems[item.id],
        });
      }
    });

    if (orderItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const address = `${data.street}, ${data.city}, ${data.state}, ${data.zipcode}, ${data.country}`;
    const fullName = `${data.firstName} ${data.lastName}`;
    const amount =
      getTotalCartAmount() + (payment === "online" ? deliveryCharge : 0);

    try {
      const response = await axios.post(
        `${url}/api/order/place`,
        {
          userId: 1,
          items: orderItems,
          amount,
          address,
          orderType: payment,
          name: fullName,
          email: data.email,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const orderId = response.data?.orderId;

      if (payment === "pickup") {
        setReceipt({ ...response.data.receipt, items: orderItems });
        setCartItems({});
      } else {
        if (!orderId) {
          toast.error("Order ID not returned from server.");
          return;
        }

        sessionStorage.setItem("lastOrderAmount", amount);
        const stripeRes = await axios.post(`${url}/api/create-checkout-session`, {
          orderId,
          tenantId: 18,
          amount,
          success_url: `${window.location.origin}/verify?success=true&orderId=${orderId}`,
          cancel_url: `${window.location.origin}/cancel`,
        });

        if (stripeRes.data?.url) {
          setCartItems({});
          window.location.href = stripeRes.data.url;
        } else {
          toast.error("Stripe session creation failed.");
        }
      }
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Server error");
    }
  };

  const orderItemsList = food_list.filter((item) => cartItems[item.id] > 0);

  return (
    <div className="place-order">
      <form className="place-order-left">
        <p className="title">General Information</p>
        <div className="form-note">
          <strong>* Required:</strong> Name, Email, Phone
          <br />
          <span className="form-note-sub">
            Online payment also requires full address
          </span>
        </div>
        <div className="multi-fields">
          <input type="text" name="firstName" placeholder="First Name *" onChange={onChangeHandler} required />
          <input type="text" name="lastName" placeholder="Last Name *" onChange={onChangeHandler} required />
        </div>
        <input type="email" name="email" placeholder="Email address *" onChange={onChangeHandler} required />
        <input type="text" name="street" placeholder="Street *" onChange={onChangeHandler} required={payment === "online"} />
        <div className="multi-fields">
          <input type="text" name="city" placeholder="City *" onChange={onChangeHandler} required={payment === "online"} />
          <input type="text" name="state" placeholder="State *" onChange={onChangeHandler} required={payment === "online"} />
        </div>
        <div className="multi-fields">
          <input type="text" name="zipcode" placeholder="Zip code *" onChange={onChangeHandler} required={payment === "online"} />
          <input type="text" name="country" placeholder="Country *" onChange={onChangeHandler} required={payment === "online"} />
        </div>
        <input type="text" name="phone" placeholder="Phone *" onChange={onChangeHandler} required />
      </form>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          {orderItemsList.length > 0 && (
            <div className="cart-items-summary">
              {orderItemsList.map((item) => (
                <div key={item.id} className="cart-item-summary">
                  <span>{item.title}</span>
                  <span>{currency}{Number(item.price).toFixed(2)} × {cartItems[item.id]}</span>
                  <span>= {currency}{(Number(item.price) * cartItems[item.id]).toFixed(2)}</span>
                </div>
              ))}
              <hr />
            </div>
          )}
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>{currency}{getTotalCartAmount().toFixed(2)}</p>
          </div>
          {payment === "online" && (
            <>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>{currency}{deliveryCharge.toFixed(2)}</p>
              </div>
            </>
          )}
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>{currency}{(getTotalCartAmount() + (payment === "online" ? deliveryCharge : 0)).toFixed(2)}</b>
          </div>
          <button className="place-order-submit" onClick={placeOrder}>
            PROCEED TO {payment === "pickup" ? "RECEIPT" : "PAYMENT"}
          </button>
        </div>

        <div className="payment">
          <h2>Payment Method</h2>
          <div className="payment-option">
            <input type="radio" name="payment" checked={payment === "pickup"} onChange={() => setPayment("pickup")} />
            <label>Pickup from Store</label>
          </div>
          <div className="payment-option">
            <input type="radio" name="payment" checked={payment === "online"} onChange={() => setPayment("online")} />
            <label>Online Payment</label>
          </div>
        </div>
      </div>

      {receipt && (
        <ReceiptPopup receipt={receipt} onClose={() => setReceipt(null)} />
      )}
    </div>
  );
};

export default PlaceOrder;
