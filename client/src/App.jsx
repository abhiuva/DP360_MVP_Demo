import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Cart from "./pages/Cart/Cart";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import ResetPasswordPopup from "./components/ResetPasswordPopup";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import MyOrders from "./pages/MyOrders/MyOrders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify/Verify";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showReset, setShowReset] = useState(false);

  return (
    <>
      <ToastContainer />
      {showLogin && (
        <LoginPopup setShowLogin={setShowLogin} setShowReset={setShowReset} />
      )}
      {showReset && <ResetPasswordPopup setShowReset={setShowReset} />}

      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route
            path="/myorders"
            element={
              localStorage.getItem("token") ? <MyOrders /> : <Navigate to="/" />
            }
          />
          <Route path="/verify" element={<Verify />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default App;
