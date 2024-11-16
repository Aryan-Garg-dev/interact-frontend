import React from 'react';
import Animation from './animation';

export const HeroTitle = () => {
  return (
    <div className="inline-block">
      <span className="md:text-7xl text-5xl font-bold">Everything</span>
      <div className="relative">
        <span className="font-birthstone text-xl absolute -top-120 left-0 rotate-[-20deg]">About</span>
      </div>
      <Animation />
    </div>
  );
};
