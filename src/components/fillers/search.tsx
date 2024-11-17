import React from 'react';

interface Props {
  title?: string;
}

const NoSearch = ({ title }: Props) => {
  const search = new URLSearchParams(window.location.search).get('search') || '';
  return (
    <div className="w-3/5 max-md:w-[95%] h-fit mx-auto px-12 max-md:px-8 rounded-md font-primary text-xl flex-center max-md:flex-col gap-2 cursor-default transition-ease-500">
      {title ? (
        <span className="font-bold text-xl text-gradient">{title}</span>
      ) : (
        <>
          No Results found for <span className="font-bold text-2xl text-gradient mb-1">&quot;{search}&quot;</span>
        </>
      )}
    </div>
  );
};

export default NoSearch;
