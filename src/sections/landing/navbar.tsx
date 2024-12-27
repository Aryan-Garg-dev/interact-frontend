import LandingButton from '@/components/buttons/landing_btn';
import Link from 'next/link';
import React from 'react';
import { ReactSVG } from 'react-svg';

const Navbar: React.FC = () => {
  return (
    <div className="w-[90vw] p-2 h-16 flex items-center justify-between z-50 text-primary_black dark:text-white">
      <div className="flex items-center md:max-h-[10vh]">
        <ReactSVG src="/onboarding_logo.svg" className="max-h-[6vh] dark:hidden" />
        <ReactSVG src="/onboarding_logo_dark.svg" className="max-h-[6vh] hidden dark:block" />
      </div>

      <div className="items-center text-[20px] md:max-h-[10vh] flex justify-center">
        {/* <div className="lg:flex hidden">
          <a href="#" className="hover:underline lg:px-8 md:block">
            Features
          </a>
          <a href="#" className="hover:underline lg:px-8">
            About Us
          </a>
        </div> */}
        <div className="flex flex-row items-center justify-center">
          <Link href="/signup">
            <LandingButton label="Sign up" />
          </Link>
          <span className="px-2 text-2xl font-thin">/</span>
          <Link href="/login" className="hover-underline-animation after:bg-black dark:after:bg-white">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
