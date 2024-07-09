import { useWindowWidth } from '@react-hook/window-size';
import React, { useEffect } from 'react';
import { ReactSVG } from 'react-svg';

const Mobile = () => {
  const width = useWindowWidth();
  useEffect(() => {
    if (width > 760) window.location.replace('/');
  }, []);

  return (
    <div className="w-full font-primary p-8 text-primary_black flex flex-col gap-8">
      <div className="w-full flex justify-start">
        <ReactSVG src="/onboarding_logo.svg" />
      </div>
      <div className="w-full h-full flex flex-col gap-4">
        <div className="text-5xl font-bold">Attention Mobile Users!</div>
        <div className="w-full flex flex-col gap-2">
          <div>
            We&apos;re hard at work building our app for the best possible experience. 🛠️ While we&apos;re in
            development, please hop onto a{' '}
            <span className="font-medium underline underline-offset-2">larger device</span> to explore Interact to its
            fullest potential.
          </div>
          <div>
            Your patience is greatly appreciated, and we can&apos;t wait to share the{' '}
            <span className="font-semibold">full Interact experience</span> with you soon! 🚀
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mobile;
