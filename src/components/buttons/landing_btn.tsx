import React from 'react';

const LandingButton = ({ label }: { label: string }) => {
  return <button className="bg-[#00BDF2] text-white px-3 py-1 rounded-full text-lg max-md:text-sm">{label}</button>;
};

export default LandingButton;
