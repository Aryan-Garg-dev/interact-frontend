import React from 'react';

interface Props {
  tag: string;
  color: string;
}

const ColoredTag = ({ tag, color }: Props) => {
  return (
    <div
      style={{ backgroundColor: color }}
      className="flex-center px-2 py-1 font-primary text-xs dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg"
    >
      {tag}
    </div>
  );
};

export default ColoredTag;
