import React from 'react';

const LandingButton = ({ label, link }: { label: string; link?: string }) => {
  return (
    <button className="w-fit bg-[#00BDF2] hover:bg-[#2a839b] text-white px-5 py-1 rounded-2xl text-lg max-md:text-sm transition-ease-300">
      {label}
    </button>
  );
};

export default LandingButton;
