import React, { useState, useEffect } from 'react';
import { FloatingImages } from './floatingimages';
import { useWindowWidth } from '@react-hook/window-size';

const TextAnimation = () => {
  const texts = ['Organizations', 'Hackathons', 'Projects'];
  const [index, setIndex] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  const width = useWindowWidth();
  const isMD = width < 768;

  useEffect(() => {
    const animate = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (index === texts.length - 1) {
        setIsResetting(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setIndex(0);
        requestAnimationFrame(() => setIsResetting(false));
      } else {
        setIndex(prev => prev + 1);
      }
    };

    const timer = setTimeout(animate, 1000);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="h-32 max-md:h-16 overflow-hidden text-black">
      <div
        className={`transform transition-ease-500 ${isResetting ? 'transition-none' : ''}`}
        style={{
          transform: `translateY(-${index * (isMD ? 64 : 128)}px)`,
        }}
      >
        {texts.map((text, i) => (
          <div
            key={i}
            className="h-32 max-md:h-16 pb-8 max-md:pb-2 flex items-center justify-center lg:text-9xl text-5xl font-bold"
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

export const HeroSection = () => {
  return (
    <div className="w-full min-h-base_md text-center relative flex-center flex-col gap-12 max-md:gap-4 z-10">
      <FloatingImages />
      <div className="flex flex-col gap-4 max-md:gap-0">
        <div className="mx-auto relative">
          <div className="w-fit md:text-7xl text-black text-4xl font-semibold">Everything</div>
          <div className="font-cursive text-black text-4xl max-md:text-xl absolute -bottom-4 -left-24 max-md:-left-16 rotate-[-20deg]">
            About
          </div>
        </div>
        <TextAnimation />
      </div>
      <div className="space-y-4">
        <p className="text-xl max-md:text-base text-gray-700 max-w-sm mx-auto">
          We&apos;re a dynamic web platform for college students, freelancers, professionals, and creatives.
        </p>

        <div className="space-y-4">
          <a href="/signup">
            <button className="bg-[#00BDF2] text-white px-6 py-2 rounded-full text-lg max-md:text-sm">
              Sign up for free
            </button>
          </a>
          <div className="flex justify-center items-center space-x-2 text-sm">
            <span className="text-gray-600">Are you Organizations ?</span>
            <a href="/signup" className="text-[#00BDF2]">
              Sign up here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
