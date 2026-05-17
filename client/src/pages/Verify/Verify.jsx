import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import './Verify.css';

const Verify = () => {
  const { url, setCartItems } = useContext(StoreContext);
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const tenantId = 18;
  const amount = sessionStorage.getItem("lastOrderAmount");
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      // Step 1: Verify order
      const response = await axios.post(`${url}/api/order/verify`, {
        success,
        orderId,
      });

      // Step 2: If successful, finalize invoice
      if (response.data.success && success === "true") {
        await axios.post(`${url}/api/stripe/finalize`, {
          order_id: orderId,
          tenant_id: tenantId,
          amount,
        });

        // ✅ Clear cart
        setCartItems({});
      }

      navigate("/myorders");
    } catch (error) {
      console.error("Verification failed:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
