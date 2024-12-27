import TooltipIcon from '@/components/common/tooltip_icon';
import FlickeringGrid from '@/components/ui/flickering-grid';
import { InstagramLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import { MailIcon } from 'lucide-react';
import React from 'react';
import { ReactSVG } from 'react-svg';

const Footer = () => {
  return (
    <div>
      <div className="relative w-4/5 mx-auto h-[250px] flex-center bg-background overflow-hidden">
        <ReactSVG src="/onboarding_logo.svg" className="scale-[2.0] z-10 dark:hidden" />
        <ReactSVG src="/onboarding_logo_dark.svg" className="scale-[2.0] z-10 hidden dark:block" />
        <FlickeringGrid
          className="z-0 absolute inset-0 size-full"
          squareSize={4}
          gridGap={6}
          color="#478EE1"
          maxOpacity={0.5}
          flickerChance={0.1}
          height={800}
          width={1200}
        />
      </div>
      <div className="w-4/5 mx-auto flex justify-between gap-6 pt-4 pb-12">
        <div className="text-gray-600 dark:text-gray-300 italic">Connect, Create & Collaborate</div>
        <div className="flex gap-4">
          <TooltipIcon label="@interact_now" icon={<LinkedInLogoIcon className="w-6 h-6" />} excludeHoverEffect />
          <TooltipIcon label="@interact_now" icon={<TwitterLogoIcon className="w-6 h-6" />} excludeHoverEffect />
          <TooltipIcon label="@interact.now" icon={<InstagramLogoIcon className="w-6 h-6" />} excludeHoverEffect />
          <TooltipIcon label="socials@interactnow.in" icon={<MailIcon className="w-6 h-6" />} excludeHoverEffect />
        </div>
      </div>
    </div>
  );
};

export default Footer;
