import React from 'react';

interface Props {
  label?: string;
  onClick?: () => void;
}

const SecondaryButton = ({ label = 'Continue', onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      type="submit"
      className="w-full relative p-2 cursor-pointer gap-2 bg-primary_text hover:bg-[#345C98] active:bg-[#2D5185] text-white rounded-lg font-semibold transition-ease-300"
    >
      <div>{label}</div>
    </button>
  );
};

export default SecondaryButton;
