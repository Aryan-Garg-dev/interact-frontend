import React from 'react';

interface Props {
  width?: string;
}

const NoOpenings = ({ width = 'full' }: Props) => {
  const variants = ['w-2/3', 'w-full'];
  return (
    <div
      className={`w-${width} max-md:w-full h-fit mx-auto px-12 max-md:px-8 py-8 rounded-md font-primary dark:text-white border-gray-300 border-[1px] bg-white dark:bg-dark_primary_comp hover:shadow-lg dark:hover:shadow-2xl flex-center flex-col gap-2 cursor-pointer transition-ease-500`}
    >
      <div className="text-xl max-md:text-lg font-medium text-center">
        <span className="text-2xl font-semibold">Oh no!</span> It seems you don&apos;t have any openings yet.
      </div>
      <div className="flex flex-col gap-1 max-md:text-sm text-center">
        <div>Don&apos;t miss out on the opportunity to attract top talent to your project!</div>
        <div>
          <span className="font-bold text-xl max-md:text-lg text-gradient">Create a New Opening</span> now and watch
          your project flourish with fresh, innovative minds. 🚀
        </div>
      </div>
    </div>
  );
};

export default NoOpenings;
