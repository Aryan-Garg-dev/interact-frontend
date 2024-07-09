import React from 'react';
import { useState } from 'react';
import Toaster from '@/utils/toaster';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next/types';
import nookies from 'nookies';
import postHandler from '@/handlers/post_handler';
import isEmail from 'validator/lib/isEmail';
import { ReactSVG } from 'react-svg';
import { ArrowRight } from '@phosphor-icons/react';
import { SERVER_ERROR } from '@/config/errors';

const ForgotPassword = () => {
  const [sentURL, setSentURL] = useState(false);
  const [resentURL, setResentURL] = useState(false);
  const [email, setEmail] = useState('');
  const [mutex, setMutex] = useState(false);

  const handleSubmit = async () => {
    if (!isEmail(email)) {
      Toaster.error('Enter a valid email.');
      return;
    }

    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Sending Link');
    const URL = `/recovery`;
    postHandler(URL, { email })
      .then(res => {
        if (res.statusCode === 200) {
          Toaster.stopLoad(toaster, 'Link Sent', 1);
          if (sentURL) setResentURL(true);
          setSentURL(true);
        } else {
          if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
          else {
            Toaster.stopLoad(toaster, SERVER_ERROR, 0);
          }
        }
      })
      .catch(err => {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      });

    setMutex(false);
  };

  return (
    <>
      <Head>
        <title>Forgot Password | Interact</title>
      </Head>
      <div className="h-screen flex">
        <div className="w-[45%] max-lg:w-full h-full font-primary py-8 px-8 flex flex-col justify-between items-center">
          <div className="w-full flex justify-start">
            <ReactSVG src="/onboarding_logo.svg" />
          </div>
          <div className="w-full flex flex-col gap-8 font-primary px-16 max-md:px-0 mb-24 max-lg:mb-12">
            {!sentURL ? (
              <>
                <div className="text-3xl font-semibold">Forgot Password</div>
                <form
                  onSubmit={el => {
                    el.preventDefault();
                    handleSubmit();
                  }}
                  className="w-full flex flex-col gap-8"
                >
                  <div className="w-full flex flex-col gap-2">
                    <div className="font-medium">Registered Email</div>
                    <input
                      name="email"
                      value={email}
                      onChange={el => setEmail(el.target.value)}
                      type="email"
                      className="w-full bg-white focus:outline-none border-2 p-2 rounded-xl text-gray-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full relative p-2 border-2 after:absolute after:-top-[3px] after:-left-[3px] after:-right-[3px] after:-bottom-[3.5px] after:-z-10 after:bg-[#395887] after:rounded-xl flex items-center cursor-pointer justify-center gap-2 bg-[#3D6DB3] hover:bg-[#345C98] active:bg-[#2D5185] border-[#d1d1d1a7] text-white py-2 rounded-xl font-semibold"
                  >
                    <div>Send Password Reset Link</div>
                    <ArrowRight size={20} weight="regular" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 px-16 max-lg:px-8 py-24 max-lg:py-16 font-Helvetica">
                <div className="text-xl text-center">
                  Reset Password Link has been sent to <b>{email}</b>. Please check your inbox.
                </div>
                {!resentURL ? (
                  <div onClick={handleSubmit} className="font-sm underline-offset-2 cursor-pointer hover:underline">
                    Didn&apos;t receive the mail? Click here to resend.
                  </div>
                ) : (
                  <></>
                )}
                <div className="text-sm">( Don&apos;t forget to check the spam folder )</div>
              </div>
            )}
          </div>
          <div className="w-3/4 max-lg:w-full text-[12px] text-center text-gray-400">
            By clicking “Continue” above, you acknowledge that you have read and understood, and agree to
            Interact&apos;s{' '}
            <span className="underline underline-offset-2 font-medium cursor-pointer">Term & Conditions</span> and{' '}
            <span className="underline underline-offset-2 font-medium cursor-pointer">Privacy Policy.</span>
          </div>
        </div>
        <div className="w-[55%] max-lg:hidden h-full bg-onboarding bg-cover"></div>
      </div>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const access_token = nookies.get(context).token;
  if (access_token && process.env.NODE_ENV != 'development') {
    return {
      redirect: {
        permanent: true,
        destination: '/home',
      },
      props: {},
    };
  } else
    return {
      props: {},
    };
}

export default ForgotPassword;
