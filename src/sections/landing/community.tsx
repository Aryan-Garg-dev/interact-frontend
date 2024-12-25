import LandingButton from '@/components/buttons/landing_btn';
import Image from 'next/image';
import React from 'react';
import { TitleBlock } from './features';
import { ReactSVG } from 'react-svg';

const Community = () => {
  return (
    <div className="w-full flex-center flex-col gap-24 max-md:gap-12 px-8 text-black">
      <div className="w-full relative flex items-center justify-center scale-[1]">
        <Image
          width={500}
          height={400}
          src="landing/explore.svg"
          alt="Community Image"
          className="w-4/5 max-md:w-full h-auto object-contain shadow-xl rounded-3xl max-md:rounded-lg"
          style={{
            transform: `perspective(1000px) rotateX(12deg) rotateY(0deg)`,
          }}
        />
      </div>
      <div className="w-1/2 mx-auto max-md:w-full flex-center flex-col gap-4">
        <TitleBlock
          titleUpper="Explore"
          titleMid="The"
          titleLower="Community"
          description="Lorem ipsum dolor sit amet consectetur. Amet varius eget tempus pulvinar aliquam nulla dolor. Etiam dignissim
          nunc diam eudismod. Nec placerat purus ultricies amet facus justo."
          center
          includeSparkles
        />
        <LandingButton label="Know More" />
      </div>
      <div className="w-1/2 mx-auto max-md:w-full flex-center flex-col gap-16">
        <TitleBlock
          titleUpper="Github & Figma "
          titleLower="Integration"
          description="Get real-time insights into Project Members progress with seamless database integration from figma and github all in one place to keep track and manage everything all at once."
          center
        />
        <ReactSVG
          src="/landing/Cards integration.svg"
          className="flex items-center justify-center bottom-0 h-[5vh] md:h-[20vh] lg:scale-[0.75] md:scale-[0.6] scale-[0.26] sm:mt-24 mt-12"
        />
      </div>
    </div>
  );
};

export default Community;
