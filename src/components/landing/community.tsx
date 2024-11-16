import React from 'react';
import { ReactSVG } from 'react-svg';
const Community = () => {
  return (
    <div className="w-full flex flex-col mx-auto">
      {/* SVG container with proper aspect ratio */}
      <div className="w-full relative flex items-center justify-center scale-[1] h-[50vh]">
        <div className="md:scale-[2.5] perspective-[1000px]">
          {/* <object data="/test@2x.svg" type="image/svg+xml" className="w-full h-auto" aria-label="Dashboard interface" /> */}
          <img
            src="explore.svg"
            className="w-full h-auto object-contain"
            style={{
              transform: `perspective(1000px) rotateX(18deg) rotateY(0deg)`,
            }}
          />
        </div>
      </div>

      {/* Text overlay section with reduced vertical spacing */}
      <div className="text-center mt-4 px-4 flex flex-col w-[100vw] items-center justify-center">
        <h1 className="text-4xl font-bold">
          Explore
          <span className="block text-lg italic text-gray-600">The</span>
          <span className="text-sky-400 block text-5xl mb-1">Community</span>
          <span className="text-xl">Interact.</span>
        </h1>

        <p className="text-gray-600 max-w-xl mx-auto mt-4 mb-6">
          Lorem ipsum dolor sit amet consectetur. Amet varius eget tempus pulvinar aliquam nulla dolor. Etiam dignissim
          nunc diam eudismod. Nec placerat purus ultricies amet facus justo.
        </p>

        <button className="bg-sky-400 text-white px-8 py-2 rounded-full hover:bg-sky-500 transition-colors">
          Know More
        </button>
        <div className="flex items-center w-[100vw] h-[40vh] md:h-[60vh] justify-center overflow-hidden">
          <ReactSVG src="/Cards integration.svg" className="mt-24 md:scale-[0.5] scale-[0.3]" />
        </div>
      </div>
    </div>
  );
};

export default Community;
