import React from 'react';

import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Toggle } from '../ui/toggle';
import { Monitor } from 'lucide-react';

type PreviewBtnProps = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const PreviewBtn = ({ show, setShow }: PreviewBtnProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle onClick={() => setShow(!show)} className="active:translate-y-1 w-fit h-fit p-1.5">
            <Monitor className="w-5 h-5" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent className="bg-neutral-50 dark:bg-dark_primary_comp_hover dark:text-white text-black shadow-lg">
          <p>Preview</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PreviewBtn;
