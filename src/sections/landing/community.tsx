import LandingButton from '@/components/buttons/landing_btn';
import Image from 'next/image';
import React from 'react';
import { ReactSVG } from 'react-svg';
import { TitleBlock } from './features';
const Community = () => {
  return (
    <div className="w-full flex-center flex-col gap-12">
      <div className="w-full relative flex items-center justify-center scale-[1]">
        <Image
          width={500}
          height={400}
          src="landing/explore.svg"
          alt="Community Image"
          className="w-4/5 h-auto object-contain"
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
        />
        <LandingButton label="Know More" />
      </div>
      {/* <ReactSVG src="/landing/Cards integration.svg" className="" /> */}
    </div>
  );
};

export default Community;
