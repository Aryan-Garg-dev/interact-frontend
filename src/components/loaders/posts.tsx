import React from 'react';

const PostsLoader = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      {Array(2)
        .fill(1)
        .map((_, index) => (
          <div
            key={index}
            className={`w-full bg-white dark:bg-transparent font-primary flex gap-1 rounded-lg dark:rounded-none dark:text-white border-gray-300 border-[1px] dark:border-x-0 dark:border-t-0 dark:border-dark_primary_btn p-4 max-md:p-2`}
          >
            <div className="h-full">
              <div className="animate-pulse w-8 h-8 bg-gray-200 dark:bg-dark_primary_comp_hover rounded-full" />
            </div>
            <div className="grow max-w-[94%] max-md:max-w-[85%] flex flex-col gap-1">
              <div className="w-full h-fit flex justify-between">
                <div className="animate-pulse delay-150 w-24 h-5 bg-gray-200 dark:bg-dark_primary_comp_hover rounded-md" />
                <div className="flex gap-2 font-light text-xs">
                  <div className="animate-pulse delay-100 w-20 h-4 bg-gray-200 dark:bg-dark_primary_comp_hover rounded-md" />
                  <div className="animate-pulse delay-75 w-8 h-4 bg-gray-200 dark:bg-dark_primary_comp_hover rounded-md" />
                </div>
              </div>
              <div className="w-full">
                <div
                  // style={{ height: Math.floor(Math.random() * (540 - 320 + 1)) + 320 }}
                  className="animate-pulse delay-200 w-full h-80 max-md:h-40 bg-gray-200 dark:bg-dark_primary_comp_hover rounded-lg"
                />
              </div>
              <div className="w-full flex flex-col gap-1 text-sm whitespace-pre-wrap mb-2">
                <div className="animate-pulse delay-75 w-full h-8 bg-gray-200 dark:bg-dark_primary_comp_hover rounded-lg" />
                <div className="animate-pulse delay-100 w-1/3 h-6 bg-gray-200 dark:bg-dark_primary_comp_hover rounded-lg" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default PostsLoader;
