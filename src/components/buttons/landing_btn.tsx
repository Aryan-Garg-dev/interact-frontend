import { cn } from '@/lib/utils';
import React from 'react';

const LandingButton = ({ label, link, className }: { label: string; link?: string; className?: string }) => {
  return (
    <button
      className={cn(
        'w-fit bg-[#00BDF2] hover:bg-[#2a839b] text-white px-5 py-1 rounded-2xl text-lg max-md:text-sm transition-ease-300',
        className
      )}
    >
      {label}
    </button>
  );
};

export default LandingButton;
