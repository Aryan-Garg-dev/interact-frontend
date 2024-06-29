import React from 'react';

const TasksLoader = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      {Array(2)
        .fill(1)
        .map((_, index) => (
          <div key={index} className="relative">
            <div className="w-full animate-pulse flex flex-col gap-2 rounded-lg p-4 border-gray-800 border-dotted border-2">
              <div className="w-full flex justify-between items-center">
                <div className="animate-pulse w-32 h-8 bg-gray-200 dark:bg-dark_primary_comp_hover rounded-md" />
                <div className="animate-pulse w-16 h-8 bg-gray-200 dark:bg-dark_primary_comp_hover rounded-md" />
              </div>
              <div className="animate-pulse w-full h-8 bg-gray-200 dark:bg-dark_primary_comp_hover rounded-xl" />
              <div className="animate-pulse w-full h-6 bg-gray-200 dark:bg-dark_primary_comp_hover rounded-lg" />
            </div>
          </div>
        ))}
    </div>
  );
};

export default TasksLoader;
