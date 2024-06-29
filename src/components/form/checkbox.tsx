import React from 'react';

interface Props {
  label?: string;
  val: boolean;
  setVal: React.Dispatch<React.SetStateAction<boolean>>;
  required?: boolean;
}

const Checkbox = ({ label, val, setVal, required = false }: Props) => {
  return (
    <label className="w-full flex justify-between cursor-pointer select-none items-center text-sm gap-2 border-[1px] border-gray-400 rounded-lg p-2">
      {label && (
        <div className="text-base font-medium text-gray-500">
          {label} {required && '*'}
        </div>
      )}
      <div className="relative">
        <input type="checkbox" checked={val} onChange={() => setVal(prev => !prev)} className="sr-only" />
        <div
          className={`box block h-6 w-10 rounded-full ${val ? 'bg-blue-300' : 'bg-black'} transition-ease-300`}
        ></div>
        <div
          className={`absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${
            val ? 'translate-x-full' : ''
          }`}
        ></div>
      </div>
    </label>
  );
};

export default Checkbox;
