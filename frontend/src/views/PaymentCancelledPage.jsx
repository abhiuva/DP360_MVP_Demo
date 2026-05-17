import React from 'react'
import AppBarDropdown from '../components/AppBarDropdown'
import Page from "../components/Page";
import Logo from "../assets/logo.png";
import { IconChevronLeft, IconCircleCheckFilled, IconCircleXFilled, IconLogout, IconX } from '@tabler/icons-react';
import { iconStroke } from '../config/config';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

export default function PaymentCancelledPage() {
  const navigate = useNavigate();
  

  return (
    <Page className=''>
      <div className="fixed flex items-center justify-between px-4 py-3 border-b border-salespos-border-green-light w-full bg-white">
        <img src={Logo} alt="logo" className="h-12 block" />

        {/* profile */}
        <AppBarDropdown />
        {/* profile */}
      </div>

      <div className="min-h-screen container mx-auto flex items-center justify-center flex-col">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4">
          <IconX size={40} stroke={1.5} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Your payment was cancelled. No charges were made. You can try again or choose a different payment method.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/dashboard/pos" className="px-6 py-2 bg-salespos-green text-white rounded-lg hover:bg-salespos-green-dark transition">
            Return to POS
          </Link>
        </div>
      </div>
    </Page>
  )
}
