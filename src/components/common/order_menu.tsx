import { Funnel } from '@phosphor-icons/react';
import React, { useEffect, useRef, useState } from 'react';
import Input from '../form/input';

interface Props {
  orders: string[];
  current: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  smallerTextForMD?: boolean;
  addSearch?: boolean;
  search?: string;
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
  zIndex?: number;
  fixed?: boolean;
  right?: boolean;
}

const OrderMenu = ({
  orders,
  current,
  setState,
  smallerTextForMD = false,
  addSearch = false,
  search,
  setSearch,
  zIndex = 25,
  fixed = true,
  right = true,
}: Props) => {
  const [showOrders, setShowOrders] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowOrders(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const variants = ['z-10', 'z-20', 'z-30', 'z-40', 'z-50'];
  return (
    <div
      ref={menuRef}
      className={`w-12 h-12 rounded-lg shadow-l border-gray-300 border-[1px] bg-white gap-1 ${
        fixed ? 'fixed top-[90px] right-12' : 'relative'
      } z-${zIndex} max-md:hidden`}
    >
      <div onClick={() => setShowOrders(prev => !prev)} className="flex-center p-3 cursor-pointer">
        <Funnel className="w-full h-full " />
      </div>
      {showOrders && (
        <div
          className={`w-48 h-fit p-2 bg-white flex flex-col gap-1 absolute -bottom-2 ${
            right ? 'right-0' : 'left-0'
          } translate-y-full rounded-md border-[1px] border-gray-300 animate-fade_third`}
        >
          {addSearch && search != undefined && setSearch != undefined && (
            <Input val={search} setVal={setSearch} maxLength={20} placeholder="Search" />
          )}
          {orders.map((order, index) => (
            <div
              key={index}
              onClick={() => setState(order)}
              className={`w-full ${
                current == orders[index]
                  ? 'bg-primary_comp_hover text-primary_text font-medium'
                  : 'hover:bg-primary_comp text-primary_black'
              } rounded-md p-2 flex-center capitalize transition-ease-300 cursor-pointer`}
            >
              {order.replaceAll('_', ' ')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderMenu;
