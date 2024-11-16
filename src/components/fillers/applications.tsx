import Link from 'next/link';
import React from 'react';

const NoApplications = () => {
  return (
    <Link
      href={'/openings'}
      className="w-full h-fit mx-auto px-12 pt-base_padding max-md:px-8 rounded-md font-primary flex-center flex-col gap-2"
    >
      <div className="text-xl max-md:text-lg font-medium text-center">
        <span className="text-2xl font-semibold">Uh oh! </span> No applications yet?
      </div>
      <div className="flex flex-col gap-1 max-md:text-sm text-center">
        <div> That&apos;s okay, we&apos;ll just be over here silently judging you. Kidding! Mostly.</div>
        <div>
          Okay let&apos;s
          <span className="w-fit mx-auto font-bold text-xl max-md:text-lg text-gradient"> Discover Openings!</span> 🧭
        </div>
      </div>
    </Link>
  );
};

export default NoApplications;
