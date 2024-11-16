import React from 'react';
import { ReactSVG } from 'react-svg';

const Navbar: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full p-2 md:max-h-[10vh]">
      <div className="flex items-center justify-between w-full max-w-[85vw] md:max-h-[10vh]">
        {/* Logo Section */}
        <div className="flex items-center md:max-h-[10vh]">
          <ReactSVG src="/onboarding_logo.svg" className="max-h-[6vh]" />
        </div>

        {/* Navigation Links Section */}
        <div className="items-center text-[20px] md:max-h-[10vh] flex justify-center">
          <div className="lg:flex hidden">
            <a href="#" className="hover:underline lg:px-8 md:block">
              Features
            </a>
            <a href="#" className="hover:underline lg:px-8">
              About Us
            </a>
          </div>
          <div className="flex flex-row items-center justify-center">
            <button className="rounded-full bg-[#00BDF2] px-4 text-white font-bold h-[4vh] flex items-center justify-center">
              Sign Up
            </button>
            <a className="px-2 text-2xl text-[#00BDF2]">/</a>
            <a href="#" className="hover:underline font-bold text-[#00BDF2] md:pr-8">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
