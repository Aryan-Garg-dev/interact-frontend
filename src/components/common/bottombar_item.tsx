import Link from 'next/link';
import React, { ReactNode } from 'react';

interface Props {
  title: string;
  icon: ReactNode;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  index: number;
}

const BottomBarItem = ({ title, icon, active, setActive, index }: Props) => {
  return (
    <Link
      href={`/${title.toLowerCase()}`}
      onClick={() => setActive(index)}
      className={`w-16 h-14 p-2 flex-center rounded-xl ${
        active == index
          ? 'bg-primary_comp_hover dark:bg-[#d9c4e656] text-primary_text dark:text-[#ffffffbc]'
          : 'hover:bg-primary_comp dark:hover:bg-[#6e6e6e2b] text-gray-500 dark:text-[#ffffffbc]'
      } relative items-center transition-ease-500`}
    >
      {icon}
    </Link>
  );
};

export default BottomBarItem;
