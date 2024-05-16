import React from 'react';

interface Props {
  content: string;
}

const ToolTip = ({ content }: Props) => {
  return (
    <div className="w-fit absolute -top-12 left-0 scale-0 px-3 rounded-lg border-2  border-gray-200 bg-white py-2 text-sm font-semibold shadow-xl transition-ease-300 capitalize group-hover:scale-100">
      {content}
    </div>
  );
};

export default ToolTip;
