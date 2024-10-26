import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
  index: number;
  maxIndex: number;
}

const PrimeWrapper: React.FC<WrapperProps> = ({ children, index, maxIndex }) => {
  let includeBorder = true;
  if (index == 0 && index == maxIndex) includeBorder = false;
  return (
    <div
      className={`w-full bg-white rounded-lg ${
        index == 0 && includeBorder ? 'rounded-tl-none' : index == maxIndex && includeBorder && 'rounded-tr-none'
      } p-base_padding`}
    >
      {children}
    </div>
  );
};

export default PrimeWrapper;
