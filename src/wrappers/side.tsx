import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
}

const SideBarWrapper: React.FC<WrapperProps> = ({ children }) => {
  return <div className="w-1/3 flex flex-col gap-4 max-md:hidden">{children}</div>;
};

export const SidePrimeWrapper: React.FC<WrapperProps> = ({ children }) => {
  return <div className="w-full backdrop-blur-sm bg-white dark:bg-dark_sidebar">{children}</div>;
};

export default SideBarWrapper;
