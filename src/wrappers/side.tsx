import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
  title?: string;
  style?: React.CSSProperties;
}

const SideBarWrapper: React.FC<WrapperProps> = ({ children }) => {
  return <div className="w-1/3 flex flex-col gap-4 max-md:hidden">{children}</div>;
};

export const SidePrimeWrapper: React.FC<WrapperProps> = ({ children, title, style }) => {
  return (
    <div
      style={style}
      className="w-full flex flex-col gap-2 bg-white dark:bg-dark_primary_comp rounded-lg p-4 transition-ease-300"
    >
      {title && <div className="w-fit text-2xl font-bold text-gradient">{title}</div>}
      {children}
    </div>
  );
};

export default SideBarWrapper;
