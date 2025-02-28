import { navbarOpenSelector } from '@/slices/feedSlice';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

//TODO: Transition animation issue of active state change

const SidebarItem = ({ title, icon, active, setActive, index, org = false, url = '', onClick }: Props) => {
  const open = useSelector(navbarOpenSelector);
  return (
    <TooltipProvider>
      <Tooltip>
          <Link
            href={`/${org ? 'organisation/' : ''}${url != '' ? url : title.toLowerCase()}`}
            onClick={() => {
              setActive(index);
              if (onClick) onClick();
            }}
            className={`${open ? 'w-[220px]' : 'w-12 '} h-10 p-[8.5px] px-3 rounded-lg font-primary text-lg ${
              active == index 
                ? 'active-item-gradient text-white'
                : 'hover:bg-primary_comp dark:hover:bg-dark_primary_comp_hover text-gray-600 dark:text-white'
            } relative font-primary font-medium items-center transition-ease-out-500`}
          >
          <TooltipTrigger>
            {icon}
          </TooltipTrigger>
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
        <TooltipContent align={'center'} side={'right'} hidden={open} sideOffset={15} className={'font-primary'}>
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SidebarItem;
