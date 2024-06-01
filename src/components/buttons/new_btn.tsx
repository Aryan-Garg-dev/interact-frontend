import { Plus } from '@phosphor-icons/react';
import React from 'react';

interface Props {
  show?: boolean;
  onClick?: () => void;
}

const NewButton = ({ show = true, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-5 max-md:bottom-[110px] right-5 max-md:right-[10px] z-10 ${
        show ? 'opacity-100' : 'opacity-0'
      } hover:scale-110 transition-ease-500 cursor-pointer`}
    >
      <div className="relative">
        <Plus
          size={48}
          className="w-14 h-14 shadow-2xl glassMorphism text-white rounded-full hover:bg-primary_comp p-3 transition-ease-300"
          weight="bold"
        />
        <div className="w-14 h-14 bg-transparent absolute rotating-border-mask opacity-20 animate-pulse top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-full -z-10 transition-ease-300"></div>
      </div>
    </button>
  );
};

export default NewButton;
