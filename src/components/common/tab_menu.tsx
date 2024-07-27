import { ActionCreatorWithPayload } from '@reduxjs/toolkit/dist/createAction';
import React from 'react';
import { useDispatch } from 'react-redux';

interface Props {
  items: string[];
  active: number;
  setReduxState?: ActionCreatorWithPayload<number>;
  setState?: React.Dispatch<React.SetStateAction<number>>;
  width?: string;
  sticky?: boolean;
  smallerTextForMD?: boolean;
}

const TabMenu = ({
  items,
  active,
  setReduxState,
  setState,
  width = '500px',
  sticky = false,
  smallerTextForMD = false,
}: Props) => {
  const dispatch = useDispatch();
  const variants = ['w-[500px]', 'w-[640px]', 'w-[720px]', 'w-[840px]', 'w-[100%]'];
  return (
    <div
      className={`${
        width == '100%' && 'w-full'
      } max-w-[100%] thin_scrollbar overflow-x-auto overflow-y-clip h-fit rounded-lg bg-gradient-to-b shadow-lg dark:shadow-outer mx-auto border-gray-300 border-[1px] dark:border-0 bg-white dark:bg-slate-100 ${
        sticky ? 'sticky' : 'fixed'
      } top-[90px] transition-ease-out-500 z-10`}
    >
      <div className={`w-[${width}] max-md:w-fit h-[50px] p-1 flex justify-around gap-1`}>
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              if (setReduxState) dispatch(setReduxState(index));
              else if (setState) setState(index);
            }}
            className={`${
              active === index
                ? 'bg-primary_comp_hover dark:bg-[#0E0C2A59] dark:shadow-inner text-primary_text dark:text-white'
                : 'hover:bg-primary_comp dark:hover:bg-dark_primary_comp_active text-gray-500 dark:text-white'
            } w-1/2 max-md:w-fit max-md:px-4 h-full font-primary font-medium flex-center text-lg ${
              smallerTextForMD ? 'max-md:text-xs' : 'max-md:text-sm'
            } rounded-md transition-ease-300 cursor-pointer`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabMenu;
