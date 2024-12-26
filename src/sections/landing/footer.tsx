import { InstagramLogo, LinkedinLogo, XLogo, YoutubeLogo } from '@phosphor-icons/react';
import React from 'react';
import { ReactSVG } from 'react-svg';

const Footer = () => {
  return (
    <footer className="w-full bg-[#042e6f] py-8 md:py-12">
      <div className="w-4/5 mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="space-y-6 md:max-w-xl">
            <div className="flex items-center gap-3.5">
              <ReactSVG src="/onboarding_logo_dark.svg" className="scale-150 ml-6 mb-2" />
            </div>
            <p className="text-white">
              We&apos;re a dynamic web platform for college students, freelancers, professionals, and creatives.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-4">
              <span className="text-white font-medium ">socials@interactnow.in</span>

              <div className="flex gap-4">
                <LinkedinLogo className="w-8 h-8 text-white" weight="fill" />
                <XLogo className="w-8 h-8 text-white" weight="fill" />
                <InstagramLogo className="w-8 h-8 text-white" weight="fill" />
                <YoutubeLogo className="w-8 h-8 text-white" weight="fill" />
              </div>
            </div>
          </div>
        </div>

        {/* <div className="h-[3px] bg-gradient-to-r from-gray-400 via-white to-gray-400 my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white">
          <div className="flex flex-wrap gap-6 md:gap-12">
            <button className="text-base md:text-xl font-semibold font-['Source Sans Pro']">Term of use</button>
            <button className="text-base md:text-xl font-semibold font-['Source Sans Pro']">Privacy Policy</button>
            <button className="text-base md:text-xl font-semibold font-['Source Sans Pro']">Support</button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base md:text-xl font-semibold font-['Source Sans Pro']">©2024 Interact, Inc.</span>
          </div>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
