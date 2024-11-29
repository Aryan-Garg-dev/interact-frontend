import { SidePrimeWrapper } from '@/wrappers/side';
import React from 'react';

const SideLoader = ({ boxes = 3 }: { boxes?: number }) => {
  return (
    <SidePrimeWrapper>
      <div className="w-full flex flex-col gap-4">
        <div className="w-3/5 h-8 rounded-lg bg-white dark:bg-dark_primary_comp_hover animate-pulse"></div>

        {Array.from({ length: boxes }).map((_, index) => (
          <div
            key={index}
            className="w-full h-16 rounded-lg bg-white dark:bg-dark_primary_comp_hover animate-pulse"
          ></div>
        ))}
      </div>
    </SidePrimeWrapper>
  );
};

export default SideLoader;
