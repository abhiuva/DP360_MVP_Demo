import { useEffect, useState } from 'react';
import axios from 'axios';

const useStoreSettings = (tenantId) => {
  const [storeSettings, setStoreSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (!tenantId) return;
        const res = await axios.get(`http://localhost:3000/api/v1/settings/public-store-details/${tenantId}`);
        console.log("✅ Store settings fetched:", res.data);
        if (res.data?.success && res.data?.data) {
          setStoreSettings(res.data.data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch store settings:", err);
      }
    };
    fetchSettings();
  }, [tenantId]);

  return storeSettings;
};

export default useStoreSettings;
