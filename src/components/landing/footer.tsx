import React from 'react';
import { ReactSVG } from 'react-svg';

const Footer = () => {
  return (
    <footer className="bg-[#042e6f] px-4 py-8 md:py-12">
      <div className="container mx-auto max-w-[80vw]">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between mb-8 md:mb-16">
          {/* Logo and Description */}
          <div className="space-y-6 mb-8 md:mb-0 md:max-w-xl">
            <div className="flex items-center gap-3.5">
              <ReactSVG src="/onboarding_logo_dark.svg" className="scale-150 ml-6  mb-2" />
            </div>
            <p className="text-white text-lg md:text-[25px] font-normal font-['Source Sans Pro']">
              We're a dynamic web platform for college students, freelancers, professionals, and creatives.
            </p>
          </div>

          {/* Contact and Social */}
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-white text-lg md:text-[25px] font-semibold font-['Source Sans Pro']">
                  Support@Interact.com
                </span>
              </div>
              <div className="flex gap-4">
                {/* Social Icons */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <ReactSVG src="/linkedin_footer.svg" />
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <ReactSVG src="/x_footer.svg" />
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <ReactSVG src="/insta_footer.svg" />
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <ReactSVG src="/youtube_footer.svg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[3px] bg-gradient-to-r from-gray-400 via-white to-gray-400 my-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white">
          <div className="flex flex-wrap gap-6 md:gap-12">
            <button className="text-base md:text-xl font-semibold font-['Source Sans Pro']">Term of use</button>
            <button className="text-base md:text-xl font-semibold font-['Source Sans Pro']">Privacy Policy</button>
            <button className="text-base md:text-xl font-semibold font-['Source Sans Pro']">Support</button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base md:text-xl font-semibold font-['Source Sans Pro']">©2024 Interact, Inc.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
