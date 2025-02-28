import React from 'react';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface Props {
  content: string;
  styles?: React.CSSProperties;
}

const CustomTooltip = ({ content, styles }: Props) => {
  return (
    <div
      style={styles}
      className="w-fit absolute -top-12 left-0 scale-0 px-3 rounded-lg bg-white dark:bg-dark_primary_comp_hover border-2 border-gray-200 dark:border-dark_primary_btn dark:text-white py-2 text-sm text-center font-semibold shadow-xl transition-ease-300 capitalize group-hover:scale-100 cursor-default"
    >
      {content}
    </div>
  );
};

export const TooltipWrapper = ({title, children, className}: {title: string, children: React.ReactNode, className?: string}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className={cn("font-primary", className)}>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default CustomTooltip;
