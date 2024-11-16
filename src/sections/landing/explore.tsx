import React from 'react';
import { ReactSVG } from 'react-svg';
import SocialMediaGrid from './socialmedia_grid';

const ExploreCommunity: React.FC = () => {
  return (
    <>
      <div className="flex justify-center pt-10 overflow-hidden">
        <div className="max-w-4xl w-full space-y-8">
          {/* Header */}
          <div className="flex flex-row items-center justify-center mt-12 text-4xl md:text-6xl space-x-4 font-semibold">
            <h2>Explore Community</h2>
            <div className="flex items-center mt-4">
              <ReactSVG src="/landing/explore_vector.svg" className="h-6 w-6 mb-8" />
            </div>
          </div>

          {/* Main Content */}
          <div className="rounded-lg px-6 space-y-8">
            <div className="flex md:flex-row flex-col items-center justify-center border-8 rounded-2xl">
              {/* Supporting Text Section */}
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold">
                  Supporting the <span className="text-blue-500">Future makers</span>
                </h2>
                <p className="text-gray-600">
                  We are proud to give back to the Student Community to create the impact needed.
                </p>
              </div>

              {/* Social Media Icons */}
              <SocialMediaGrid />
            </div>

            {/* Testimonial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(item => (
                <div key={item} className="bg-white p-4 rounded-lg shadow space-y-4">
                  <p className="text-gray-800">
                    "Lorem ipsum dolor sit amet consectetur. Dui dictum ut tellus cursus ac mauris sagittis cras.
                    Ultricies est interdum arcu quis. Egestas sagittis fusce vitae massa donec tincidunt elementum."
                  </p>
                  <div className="flex justify-between items-center text-gray-500 text-sm">
                    <span>Chomu</span>
                    <span>@Zexgar29</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex justify-center items-center w-[100vw]">
        <div
          className="absolute inset-0 pointer-events-none flex justify-center items-center"
          style={{
            background: `
            linear-gradient(to bottom, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 1) 80%),
            linear-gradient(to right, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 1) 80%),
            linear-gradient(to left, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 1) 80%)`,
          }}
        ></div>
        <div className=" w-[80w] overflow-hidden">
          <ReactSVG src="/landing/bg-interact.svg" className="flex justify-center overflow-hidden" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <ReactSVG src="/onboarding_logo.svg" className="mb-24 scale-[2.0]" />
        </div>
      </div>
    </>
  );
};

export default ExploreCommunity;
