import Link from 'next/link';
import React from 'react';

const NoProjects = () => {
  return (
    <Link
      href={'/projects'}
      className="w-2/3 max-md:w-[90%] h-fit mx-auto my-8 px-12 max-md:px-8 py-8 rounded-md font-primary dark:text-white border-gray-300 border-[1px] bg-white dark:bg-dark_primary_comp hover:shadow-lg dark:hover:shadow-2xl flex-center flex-col gap-2 transition-ease-500"
    >
      <div className="text-xl max-md:text-lg font-medium text-center">
        <span className="text-2xl font-semibold">Oi! </span> Looking for something to do?
      </div>
      <div className="flex flex-col gap-1 max-md:text-sm text-center">
        <div> Check out some awesome projects and lend a hand. Your skills could be just what they need!</div>
        <div>
          Feel free to
          <span className="w-fit mx-auto font-bold text-xl max-md:text-lg text-gradient"> Discover Projects!</span> 🔍
        </div>
      </div>
    </Link>
  );
};

export default NoProjects;
