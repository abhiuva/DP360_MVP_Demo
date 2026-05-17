import React, { useEffect, useState, useContext } from "react";
import "./MyOrders.css";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { url, currency, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      // Check for expired or missing token
      if (!token) {
        toast.error("Please log in to view your orders.");
        navigate("/");
        return;
      }

      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem("token");
          setToken("");
          toast.error("Session expired. Please log in again.");
          navigate("/");
          return;
        }
      } catch (err) {
        localStorage.removeItem("token");
        setToken("");
        toast.error("Invalid token. Please log in again.");
        navigate("/");
        return;
      }

      try {
        const res = await axios.get(`${url}/api/order/myorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setOrders(res.data.orders);
        } else {
          toast.error("Failed to load orders");
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
        toast.error("Server error. Please try again.");
      }
    };

    fetchOrders();
  }, [url, setToken, navigate]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="Parcel Icon" />
              <div>
                <p>
                  <strong>Order Number:</strong> #{order.token_no}
                </p>
                <p>
                  <strong>Type:</strong> {order.delivery_type}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color: order.status === "created" ? "orange" : "green",
                    }}
                  >
                    {order.status === "created" ? "Pending" : order.status}
                  </span>
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.date).toLocaleString()}
                </p>

                {order.items && order.items.length > 0 && (
                  <div className="order-items">
                    <p>
                      <strong>Items:</strong>
                    </p>
                    <ul>
                      {order.items.map((item, i) => (
                        <li key={i}>
                          {item.item_name} × {item.quantity} — {currency}
                          {Number(item.price).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p>
                  <strong>Total:</strong> {currency}
                  {order.total}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
