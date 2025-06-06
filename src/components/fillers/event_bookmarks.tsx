import Link from 'next/link';
import React from 'react';

const NoEventBookmarks = () => {
  return (
    <Link
      href={'/events'}
      className="h-fit mx-auto px-12 rounded-md font-primary dark:text-white bg-white dark:bg-dark_primary_comp hover:shadow-lg dark:hover:shadow-2xl flex-center flex-col gap-2 transition-ease-500"
    >
      <div className="text-xl max-md:text-lg font-medium text-center">
        <span className="text-2xl font-semibold">Whoops! </span> aren&apos;t you saving your favorite events?
      </div>
      <div className="flex flex-col gap-1 max-md:text-sm text-center">
        <div>Discover exciting events and seize the opportunity to create unforgettable memories! 🌐</div>
        <div>
          Start building your
          <span className="w-fit mx-auto font-bold text-xl max-md:text-lg text-gradient"> Bucket List Today!</span> 🚀
        </div>
      </div>
    </Link>
  );
};

export default NoEventBookmarks;
