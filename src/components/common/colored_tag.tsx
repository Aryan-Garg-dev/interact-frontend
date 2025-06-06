import React, { ReactNode } from 'react';

interface Props {
  tag: string | ReactNode;
  color?: string;
  onClick?: () => void;
}

const ColoredTag = ({ tag, color = '#ffffff', onClick }: Props) => {
  return (
    <div
      style={{ backgroundColor: color }}
      onClick={onClick}
      className="flex-center px-2 py-1 font-primary text-xs dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg"
    >
      {tag}
    </div>
  );
};

export default ColoredTag;
