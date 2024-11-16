import Image from 'next/image';
import React from 'react';

export const FloatingImages = () => {
  return (
    <div className="w-[100vw] overflow-hidden">
      <div className="absolute opacity-90 top-0 left-32 max-md:left-0">
        <Image
          width={400}
          height={1000}
          src="/landing/floating/image1.svg"
          alt="Left UI"
          className="scale-[1.05] -translate-x-1/2"
        />
      </div>
      <div className="absolute right-52 max-md:right-0 top-0 w-96 opacity-90">
        <Image
          width={300}
          height={400}
          src="/landing/floating/image3.svg"
          alt="Right UI"
          className="scale-[1.2] translate-x-full"
        />
      </div>
      <div className="absolute bottom-12 md:left-64 w-48 opacity-90">
        <Image
          width={1000}
          height={1000}
          src="/landing/floating/image3.svg"
          alt="Bottom Left UI"
          className="scale-[1.05] -translate-x-1/2"
        />
      </div>
      <div className="absolute bottom-0 w-32 md:right-48 opacity-90 -right-8  ">
        <Image
          width={1000}
          height={1000}
          src="/landing/floating/image4.svg"
          alt="Bottom Right UI"
          className="scale-[1.6] md:scale-[2]"
        />
      </div>
    </div>
  );
};
