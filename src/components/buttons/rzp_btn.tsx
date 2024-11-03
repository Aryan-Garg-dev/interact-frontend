import { SERVER_ERROR } from '@/config/errors';
import postHandler from '@/handlers/post_handler';
import { setSubscription, userSelector } from '@/slices/userSlice';
import Toaster from '@/utils/toaster';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Props {
  subscription: string;
  title?: string;
}

const RazorpayButton = ({ subscription, title }: Props) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchOrderData = async () => {
    const URL = `subscriptions`;
    const res = await postHandler(URL, { type: subscription });
    if (res.statusCode == 200) {
      return res.data.subscriptionID;
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  const user = useSelector(userSelector);
  const dispatch = useDispatch();

  const handlePayment = async () => {
    const subscriptionID = await fetchOrderData();

    if (!subscriptionID) return;

    const options = {
      key: process.env.NEXT_PUBLIC_RZP_KEY,
      currency: 'INR',
      name: 'Interact',
      description: '',
      image: 'https://mailer.interactnow.in/logo.png',
      subscription_id: subscriptionID,
      handler: function () {
        dispatch(setSubscription(subscription));
        Toaster.success('Payment Successful!');
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phoneNo,
      },
      modal: {
        confirm_close: true,
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response: any) {
      Toaster.error(response.error.reason);
    });

    rzp1.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="w-40 text-lg bg-slate-100 border-2 text-black border-[#1f1f1f] hover:text-white py-1 rounded-xl hover:bg-[#1f1f1f] animate-fade_third disabled:opacity-50 disabled:cursor-default transition-ease-200"
    >
      {title || 'Pay Now'}
    </button>
  );
};

export default RazorpayButton;
