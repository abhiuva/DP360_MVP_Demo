import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin, setShowReset }) => {
  const { setToken, url } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Sign Up");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const api =
      currState === "Login" ? "/api/users/login" : "/api/users/register";

    const payload =
      currState === "Login"
        ? { email: data.email, password: data.password }
        : {
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone, // ✅ include phone here
          };

    try {
      const response = await axios.post(url + api, payload);

      if (currState === "Login" && response.data.token) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        setShowLogin(false);
        toast.success("Login successful");
      } else if (currState === "Sign Up" && response.status === 200) {
        toast.success("Registration successful");
        setShowLogin(false);
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Email or phone already in use");
      } else if (err.response?.status === 401) {
        toast.error("Invalid credentials");
      } else {
        toast.error("Server error");
      }
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <div
            className="login-popup-close"
            onClick={() => setShowLogin(false)}
          >
            ✖
          </div>
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <>
              <input
                name="name"
                type="text"
                placeholder="Your name"
                value={data.name}
                onChange={onChangeHandler}
                required
              />
              <input
                name="phone"
                type="text"
                placeholder="Phone"
                value={data.phone}
                onChange={onChangeHandler}
                required
              />
            </>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={data.email}
            onChange={onChangeHandler}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={onChangeHandler}
            required
          />
        </div>

        <button type="submit">
          {currState === "Login" ? "Login" : "Create Account"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        <div className="login-popup-login">
          {currState === "Login" ? (
            <>
              <p>
                Create a new account?{" "}
                <span onClick={() => setCurrState("Sign Up")}>Click here</span>
              </p>
              <p
                style={{
                  color: "blue",
                  cursor: "pointer",
                  marginTop: "0.5rem",
                }}
                onClick={() => {
                  setShowLogin(false);
                  setShowReset(true);
                }}
              >
                Forgot Password?
              </p>
            </>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setCurrState("Login")}>Login here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPopup;
