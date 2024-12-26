import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface Props {
  orders: string[];
  current: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

const OrderMenu = ({ orders, current, setState }: Props) => {
  return (
    <ToggleGroup
      className="w-full flex-center gap-4 max-md:flex-wrap"
      value={current}
      onValueChange={value => setState(value)}
      type="single"
    >
      {orders.map((order, index) => (
        <ToggleGroupItem className="capitalize max-md" key={index} value={order} size="lg">
          {order.replaceAll('_', ' ')}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default OrderMenu;
