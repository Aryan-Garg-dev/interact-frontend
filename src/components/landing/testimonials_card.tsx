import React from 'react';
import { ReactSVG } from 'react-svg';

export const TestimonialsCard = ({ user, text }: { user: String; text: String }) => {
  return (
    <div
      className="flex flex-col space-y-4 
                    w-[90vw] sm:w-[70vw] md:w-[28vw] lg:w-[25vw] xl:w-[20vw]
                    min-h-[200px] md:min-h-[220px]
                    bg-[#ADE9FB] 
                    rounded-[15px] 
                    px-4 py-4 "
    >
      <div className="flex justify-between items-center w-full px-4 text-center">
        <div className="text-left font-medium">{user}</div>
        <ReactSVG src="/insta_logo.svg" />
      </div>
      <div className="w-full text-wrap text-center text-sm sm:text-base">"{text}"</div>
    </div>
  );
};

export default TestimonialsCard;
