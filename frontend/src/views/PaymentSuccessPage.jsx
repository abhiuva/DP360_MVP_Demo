import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyStripePayment, completeOrderAfterPayment } from '../controllers/payment.controller';
import toast from 'react-hot-toast';
import { IconCheck, IconExclamationMark } from '@tabler/icons-react';
import { iconStroke } from '../config/config';
import AppBarDropdown from '../components/AppBarDropdown'
import Page from "../components/Page";
import Logo from "../assets/logo.png";
import { IconCircleCheckFilled, IconLogout } from '@tabler/icons-react';
import { signOut } from '../controllers/auth.controller';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      // Get the session_id from URL
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');
      
      if (!sessionId) {
        setError('Invalid payment session');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Verify the payment with Stripe
        const verifyResponse = await verifyStripePayment(sessionId);
        
        if (verifyResponse.status === 200) {
          const { orderId, paymentId } = verifyResponse.data;
          
          // Complete the order in our system
          const completeResponse = await completeOrderAfterPayment(orderId, paymentId);
          
          if (completeResponse.status === 200) {
            setPaymentData(completeResponse.data);
            toast.success('Payment completed successfully!');
          } else {
            setError('Error completing order');
          }
        } else {
          setError('Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setError(error.response?.data?.message || 'An error occurred during payment verification');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-salespos-green border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Verifying your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4">
          <IconExclamationMark size={40} stroke={1.5} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Verification Failed</h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/dashboard/pos" className="px-6 py-2 bg-salespos-green text-white rounded-lg hover:bg-salespos-green-dark transition">
            Return to POS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Page className=''>
      <div className="fixed flex items-center justify-between px-4 py-3 border-b border-salespos-border-green-light w-full bg-white">
        <img src={Logo} alt="logo" className="h-12 block" />

        {/* profile */}
        <AppBarDropdown />
        {/* profile */}
      </div>

      <div className="min-h-screen container mx-auto flex items-center justify-center flex-col">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-salespos-green mb-4">
          <IconCheck size={40} stroke={1.5} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Your payment has been processed successfully. Thank you for your purchase!
        </p>
        
        {paymentData && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-full max-w-md">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{paymentData.orderId}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">{paymentData.currency} {paymentData.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-salespos-green">Paid</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/dashboard/pos" className="px-6 py-2 bg-salespos-green text-white rounded-lg hover:bg-salespos-green-dark transition">
            Return to POS
          </Link>
          <Link to="/dashboard/orders" className="px-6 py-2 border border-salespos-green text-salespos-green rounded-lg hover:bg-salespos-green-light transition">
            View Orders
          </Link>
        </div>
      </div>
    </Page>
  );
}
