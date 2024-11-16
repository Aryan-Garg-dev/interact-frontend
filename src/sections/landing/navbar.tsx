import React from 'react';
import { ReactSVG } from 'react-svg';

const Navbar: React.FC = () => {
  return (
    <div className="w-full p-2 h-16 bg-white flex items-center justify-between z-50">
      <div className="flex items-center md:max-h-[10vh]">
        <ReactSVG src="/onboarding_logo.svg" className="max-h-[6vh]" />
      </div>

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
          <button className="bg-[#00BDF2] text-white px-3 py-1 rounded-full text-lg max-md:text-sm">Sign up</button>
          <span className="px-2 text-2xl text-[#00BDF2]">/</span>
          <a href="#" className="hover:underline font-bold text-[#00BDF2] max-md:text-sm">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
