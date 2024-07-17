import { SERVER_ERROR } from '@/config/errors';
import postHandler from '@/handlers/post_handler';
import { setSubscription, userSelector } from '@/slices/userSlice';
import Toaster from '@/utils/toaster';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import BlackButton from './black_btn';

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
      return res.data.order;
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  const user = useSelector(userSelector);
  const dispatch = useDispatch();

  const handlePayment = async () => {
    const order = await fetchOrderData();

    if (!order) return;

    const options = {
      key: process.env.NEXT_PUBLIC_RZP_KEY,
      amount: order.amount,
      currency: 'INR',
      name: 'Interact',
      description: '',
      image: 'https://mailer.interactnow.in/logo.png',
      order_id: order.id,
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

  return <BlackButton label={title ? title : 'Pay Now'} width="40" onClick={handlePayment} />;
};

export default RazorpayButton;
