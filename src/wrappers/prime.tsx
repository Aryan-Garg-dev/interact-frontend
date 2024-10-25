import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
  index: number;
  maxIndex: number;
}

const PrimeWrapper: React.FC<WrapperProps> = ({ children, index, maxIndex }) => {
  return (
    <div
      className={`w-full bg-white rounded-sm ${
        index == 0 ? 'rounded-tl-none' : index == maxIndex && 'rounded-tr-none'
      } pb-base_padding`}
    >
      {children}
    </div>
  );
};

export default PrimeWrapper;
