import React from 'react';

interface Props {
  label: string;
  onClick?: () => void;
  animateIn?: boolean;
  disabled?: boolean;
  width?: string;
  textSize?: string;
}

const BlackButton = ({ label, onClick, animateIn = true, disabled, width = '32', textSize = 'lg' }: Props) => {
  const variants = ['w-32', 'w-40', 'w-fit', 'text-lg', 'text-base', 'text-sm'];
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-${width} text-${textSize} bg-slate-100 border-2 text-black border-[#1f1f1f] hover:text-white py-1 rounded-xl hover:bg-[#1f1f1f] ${
        animateIn && 'animate-fade_third'
      } disabled:opacity-50 disabled:cursor-default transition-ease-200`}
    >
      {label}
    </button>
  );
};

export default BlackButton;
