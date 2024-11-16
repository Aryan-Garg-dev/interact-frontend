import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const CTASection = () => {
  return (
    <div className="space-y-4 mt-12">
      <p className="text-xl text-gray-700 max-w-sm mx-auto">
        We're a dynamic web platform for college students, freelancers, professionals, and creatives.
      </p>

      <div className="space-y-4">
        <button className="bg-[#00BDF2] text-white px-8 py-3 rounded-full text-lg">Sign up for free</button>
        <div className="flex justify-center items-center space-x-2 text-sm">
          <span className="text-gray-600">Are you Organizations ?</span>
          <a href="#" className="text-[#00BDF2]">
            Sign up here
          </a>
        </div>
        <button className="bg-blue-50 text-blue-600 px-8 py-3 rounded-full">Explore</button>
      </div>
    </div>
  );
};
