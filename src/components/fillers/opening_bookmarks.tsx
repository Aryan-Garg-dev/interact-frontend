import { setExploreTab } from '@/slices/feedSlice';
import Link from 'next/link';
import React from 'react';
import { useDispatch } from 'react-redux';

const NoOpeningBookmarks = () => {
  const dispatch = useDispatch();
  return (
    <Link
      href={'/explore'}
      onClick={() => dispatch(setExploreTab(1))}
      className="w-full h-fit mx-auto px-12 pt-base_padding max-md:px-8 rounded-md font-primary flex-center flex-col gap-2"
    >
      <div className="text-xl max-md:text-lg font-medium text-center">
        <span className="text-2xl font-semibold">Whoops! </span> aren&apos;t you saving your favorite openings?
      </div>
      <div className="flex flex-col gap-1 max-md:text-sm text-center">
        <div> Explore exciting opportunities and click that Bookmark button to keep track of them! 🚀</div>
        <div>
          Get started on your
          <span className="w-fit mx-auto font-bold text-xl max-md:text-lg text-gradient"> Checklist Today!</span> 📚
        </div>
      </div>
    </Link>
  );
};

export default NoOpeningBookmarks;
