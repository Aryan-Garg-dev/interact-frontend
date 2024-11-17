import LandingButton from '@/components/buttons/landing_btn';
import React from 'react';
import { ReactSVG } from 'react-svg';

const Navbar: React.FC = () => {
  return (
    <div className="md:w-[80vw] w-[90vw]  p-2 h-16 flex items-center justify-between z-50">
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
          <a href="/signup">
            <LandingButton label="Sign up" />
          </a>
          <span className="px-2 text-2xl text-[#00BDF2]">/</span>
          <a href="/login" className="hover:underline font-bold text-[#00BDF2] max-md:text-sm">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
