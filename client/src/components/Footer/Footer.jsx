import React, { useEffect, useState } from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
import axios from "axios";

const Footer = () => {
  const [storeInfo, setStoreInfo] = useState({});
  const tenantId = import.meta.env.VITE_TENANT_ID;

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BACKEND
          }/settings/public-store-details/${tenantId}`
        );
        if (res.data.success) {
          setStoreInfo(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load store info:", err);
      }
    };
    if (tenantId) fetchStoreInfo();
  }, [tenantId]);

  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="logo" />
          <p>Something about the company</p>
          <div className="footer-social-icons"></div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            {storeInfo.phone && (
              <li>
                <a href={`tel:${storeInfo.phone}`}>{storeInfo.phone}</a>
              </li>
            )}
            {storeInfo.email && (
              <li>
                <a href={`mailto:${storeInfo.email}`}>{storeInfo.email}</a>
              </li>
            )}
          </ul>

          {storeInfo.storeName && (
            <>
              <ul>
                <li>{storeInfo.storeName}</li>
                <li>{storeInfo.address}</li>
              </ul>
            </>
          )}
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 © All Right Reserved.</p>
    </div>
  );
};

export default Footer;
