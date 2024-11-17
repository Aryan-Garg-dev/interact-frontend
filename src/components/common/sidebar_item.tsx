import { navbarOpenSelector } from '@/slices/feedSlice';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';

interface Props {
  title: string;
  icon: ReactNode;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  index: number;
  org?: boolean;
  url?: string;
  onClick?: () => void;
}

const SidebarItem = ({ title, icon, active, setActive, index, org = false, url = '', onClick }: Props) => {
  const open = useSelector(navbarOpenSelector);
  return (
    <Link
      href={`/${org ? 'organisation/' : ''}${url != '' ? url : title.toLowerCase()}`}
      onClick={() => {
        setActive(index);
        if (onClick) onClick();
      }}
      className={`${open ? 'w-[220px]' : 'w-10 '} h-10 p-[8.5px] rounded-lg ${
        active == index
          ? 'bg-primary_comp_hover dark:bg-dark_primary_comp_active text-primary_text dark:text-white'
          : 'hover:bg-primary_comp dark:hover:bg-dark_primary_comp_hover text-gray-500 dark:text-white'
      } relative font-primary font-medium items-center transition-ease-out-500`}
    >
      {icon}
      {
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${
            open ? 'opacity-100 left-[64px]' : 'opacity-0 left-[0px] animate-shrink'
          } transition-ease-500`}
        >
          {title}
        </div>
      }
    </Link>
  );
};

export default SidebarItem;
