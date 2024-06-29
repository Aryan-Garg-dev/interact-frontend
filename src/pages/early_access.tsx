import React from 'react';
import { ReactSVG } from 'react-svg';
import { useState } from 'react';
import Toaster from '@/utils/toaster';
import Head from 'next/head';
import postHandler from '@/handlers/post_handler';
import { SERVER_ERROR } from '@/config/errors';
import { ArrowRight } from '@phosphor-icons/react';
import Link from 'next/link';
import isEmail from 'validator/lib/isEmail';
import { GetServerSidePropsContext } from 'next/types';

const EarlyAccess = () => {
  const [tokenSent, setTokenSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!isEmail(email)) {
      Toaster.error('Enter a Valid Email');
      return;
    }
    const toaster = Toaster.startLoad('Delivering your Token!');
    const URL = `/early_access`;
    postHandler(URL, { email })
      .then(res => {
        if (res.statusCode === 201) {
          setTokenSent(true);
          Toaster.stopLoad(toaster, 'Token Delivered!', 1);
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
  };

  return (
    <>
      <Head>
        <title>Early Access | Interact</title>
        <meta
          name="description"
          content="Sign up for Interact! Interact is a groundbreaking web platform designed for college-going students, freelancers, professionals, and creatives.  Get your exclusive token and be among the first to explore the wonders of our platform. Join us on this exclusive journey of collaboration and creativity! 🚀"
        />
      </Head>
      <div className="h-screen flex">
        <div className="w-[45%] max-lg:w-full h-full font-primary p-8 max-md:p-4 flex flex-col justify-between items-center">
          <div className="w-full flex justify-start">
            <ReactSVG src="/onboarding_logo.svg" />
          </div>
          <div className="w-4/5 max-md:w-full flex flex-col items-center gap-6">
            {!tokenSent ? (
              <form
                onSubmit={el => {
                  el.preventDefault();
                  handleSubmit();
                }}
                className="w-full flex flex-col gap-6 max-lg:px-8 py-12 max-lg:py-16 max-md:p-4"
              >
                <div className="text-5xl font-semibold text-primary_black">
                  Unlock <span className="">Early Access</span> Now!
                </div>
                <div className="flex flex-col gap-1 my-2">
                  <div className="text-xl font-medium">
                    Your Exclusive Pass to <span className="font-semibold">Interact</span> Awaits!
                  </div>
                  <div className="text-sm">
                    Enter your email to receive an exclusive token and be{' '}
                    <span className="underline underline-offset-2">among the first</span> to explore the wonders of our
                    platform. Join us on this exclusive journey of collaboration and creativity! 🚀
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <input
                    name="email"
                    value={email}
                    onChange={el => setEmail(el.target.value)}
                    type="email"
                    placeholder="Enter your email here"
                    className="w-full bg-white focus:outline-none border-2 p-2 rounded-xl text-gray-400"
                  />
                </div>

                <div className="w-full flex flex-col gap-4 items-center">
                  <button
                    type="submit"
                    className="w-full relative p-2 border-2 after:absolute after:-top-[3px] after:-left-[3px] after:-right-[3px] after:-bottom-[3.5px] after:-z-10 after:bg-[#395887] after:rounded-xl flex items-center cursor-pointer justify-center gap-2 bg-[#3D6DB3] hover:bg-[#345C98] active:bg-[#2D5185] border-[#d1d1d1a7] text-white py-2 rounded-xl font-semibold"
                  >
                    <div> Continue</div>
                    <ArrowRight size={20} weight="regular" />
                  </button>
                  <Link href={'/signup'} className="text-gray-400 text-sm cursor-pointer">
                    Already got your token? <span className="font-medium underline underline-offset-2">SignUp</span>{' '}
                    Here
                  </Link>
                </div>
              </form>
            ) : (
              <div className="w-full flex flex-col gap-6 max-lg:px-8 py-12 max-lg:py-16 max-md:p-4">
                <div className="text-5xl font-semibold text-primary_black">
                  Your <span className="">Early Access</span> is Ready!
                </div>
                <div className="flex flex-col gap-1 my-2">
                  <div className="text-xl font-medium">
                    You are just ONE step away from entering <span className="font-semibold">Interact!</span>
                  </div>
                  <div className="text-sm">
                    Use the exclusive token sent to your email address and complete the sign up process to embark on the{' '}
                    <span className="font-semibold">Interact</span> experience ahead of the crowd!
                  </div>
                </div>

                <Link href={'/signup'} className="w-full flex flex-col gap-4 items-center">
                  <button
                    type="submit"
                    className="w-full relative p-2 border-2 after:absolute after:-top-[3px] after:-left-[3px] after:-right-[3px] after:-bottom-[3.5px] after:-z-10 after:bg-[#395887] after:rounded-xl flex items-center cursor-pointer justify-center gap-2 bg-[#3D6DB3] hover:bg-[#345C98] active:bg-[#2D5185] border-[#d1d1d1a7] text-white py-2 rounded-xl font-semibold"
                  >
                    <div> Complete Sign Up</div>
                    <ArrowRight size={20} weight="regular" />
                  </button>
                </Link>
              </div>
            )}
          </div>

          <Link
            href={'/home'}
            className="w-fit relative px-8 py-2 border-2 after:absolute after:-top-[3px] after:-left-[3px] after:-right-[3px] after:-bottom-[3.5px] after:-z-10 after:bg-[#395887] after:rounded-xl flex items-center cursor-pointer justify-center gap-2 bg-[#3D6DB3] hover:bg-[#345C98] active:bg-[#2D5185] border-[#d1d1d1a7] text-white rounded-xl font-semibold"
          >
            <div>Continue without Signing in</div>
            <ArrowRight size={20} weight="regular" />
          </Link>

          <div className="w-3/4 max-lg:w-full text-[12px] text-center text-gray-400">
            By clicking “Continue” above, you acknowledge that you have read and understood, and agree to
            Interact&apos;s <span className="underline underline-offset-2 font-medium">Term & Conditions</span> and{' '}
            <span className="underline underline-offset-2 font-medium">Privacy Policy.</span>
          </div>
        </div>
        <div className="w-[55%] max-lg:hidden h-full bg-onboarding bg-cover"></div>
      </div>
    </>
  );
};

export default EarlyAccess;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return {
    redirect: {
      permanent: true,
      destination: '/signup',
    },
    props: {},
  };
};
