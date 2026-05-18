import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { API } from "../config/config";

export default function StripeSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processStripePayment = async () => {
      const queryParams = new URLSearchParams(location.search);
      const orderIds = queryParams.get("orderIds")?.split(",") || [];
      const tenantId = queryParams.get("tenantId");
      const subTotal = queryParams.get("subTotal");
      const taxTotal = queryParams.get("taxTotal");
      const discount = queryParams.get("discount");
      const total = queryParams.get("total");

      if (!orderIds.length || !tenantId || !total) {
        toast.error("Missing payment details!");
        navigate("/dashboard/orders");
        return;
      }

      try {
        await axios.post(
          `${API}/orders/public/complete-and-pay-order`,
          {
            orderIds,
            subTotal,
            taxTotal,
            discount,
            total,
            selectedPaymentType: null,
            tenantId,
          }
        );

        toast.success("Order completed successfully.");
      } catch (error) {
        console.error("Stripe success error:", error);
        toast.error("Stripe post-payment processing failed.");
      } finally {
        setTimeout(() => {
          navigate("/dashboard/orders");
        }, 1000);
      }
    };

    processStripePayment();
  }, []);

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <h2 className="text-2xl font-semibold text-green-600">
        Stripe payment success. Finalizing...
      </h2>
    </div>
  );
}
