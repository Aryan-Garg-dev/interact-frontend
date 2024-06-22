import { Funnel } from '@phosphor-icons/react';
import React, { useState } from 'react';
import Input from '../form/input';

interface Props {
  orders: string[];
  current: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  smallerTextForMD?: boolean;
  addSearch?: boolean;
  search?: string;
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
}

const OrderMenu = ({
  orders,
  current,
  setState,
  smallerTextForMD = false,
  addSearch = false,
  search,
  setSearch,
}: Props) => {
  const [showOrders, setShowOrders] = useState(false);
  return (
    <div className="w-12 h-12 rounded-lg shadow-l border-gray-300 border-[1px] bg-white gap-1 fixed top-[90px] right-12 z-10">
      <div onClick={() => setShowOrders(prev => !prev)} className="flex-center p-3 cursor-pointer">
        <Funnel className="w-full h-full " />
      </div>
      {showOrders && (
        <div className="w-48 h-fit p-2 bg-white flex flex-col gap-1 absolute -bottom-2 right-0 translate-y-full rounded-md border-[1px] border-gray-300 animate-fade_third">
          {addSearch && search != undefined && setSearch != undefined && (
            <Input val={search} setVal={setSearch} maxLength={20} placeholder="Search" />
          )}
          {orders.map((order, index) => (
            <div
              key={index}
              onClick={() => setState(order)}
              className={`w-full ${
                current == orders[index] ? 'bg-primary_comp_hover text-primary_text' : 'hover:bg-primary_comp'
              } rounded-md p-2 flex-center transition-ease-300 cursor-pointer`}
            >
              {order}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderMenu;
