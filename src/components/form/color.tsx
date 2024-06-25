import React from 'react';
import { ColorResult, SketchPicker, SliderPicker } from 'react-color';

interface Props {
  label?: string;
  val: string;
  setVal: (color: ColorResult) => void;
  required?: boolean;
}

const Color = ({ label, val, setVal, required = false }: Props) => {
  return (
    <div>
      {label && (
        <div className="text-xs ml-1 font-medium uppercase text-gray-500 mb-1">
          {label}
          {required && '*'}
        </div>
      )}
      <SliderPicker color={val} onChangeComplete={setVal} />
    </div>
  );
};

export default Color;
