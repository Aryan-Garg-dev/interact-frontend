import React from 'react';

const LandingButton = ({ label, link }: { label: string; link?: string }) => {
  return (
    <button className="w-fit bg-[#00BDF2] text-white px-5 py-1 rounded-full text-lg max-md:text-sm">{label}</button>
  );
};

export default LandingButton;
