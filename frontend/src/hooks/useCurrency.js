import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../config/config";

const useCurrency = () => {
  const [currency, setCurrency] = useState("₹"); // fallback

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`${API}/settings/store-setting`, { withCredentials: true });
        if (mounted && res?.data?.currency) setCurrency(res.data.currency);
      } catch (err) {
        console.error("useCurrency error:", err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return currency;
};

export default useCurrency;
