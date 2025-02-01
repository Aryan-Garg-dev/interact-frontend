import { cn } from '@/lib/utils';
import React from 'react';
import Editor from '@/components/editor';

interface Props {
  label?: string;
  val: string;
  setVal?: React.Dispatch<React.SetStateAction<string>>;
  maxLength?: number;
  placeholder?: string;
  required?: boolean;
  className?: string;
  editable?: boolean
}

const EditorInput = ({ label, editable = true, val, setVal, maxLength, placeholder, required = false, className }: Props) => {
  return (
    <div className="w-full">
      {label && (
        <div className="text-xs ml-1 font-medium uppercase text-gray-500 dark:text-gray-300">
          {label}
          {required && '*'} ({val.trim().length}/{maxLength})
        </div>
      )}
      {editable && setVal ?
        <Editor
          editable={true}
          content={val}
          setContent={setVal}
          limit={maxLength}
          placeholder={placeholder}
          className={cn('w-full min-h-[80px] max-h-80 dark:text-white bg-transparent focus:outline-none border-[1px] border-gray-400 dark:border-dark_primary_btn rounded-lg px-2 py-2')}
          enableMentions={false}
        /> :
        <Editor
          editable={false}
          content={val}
          className={cn('w-full min-h-[80px] max-h-80 dark:text-white bg-transparent focus:outline-none border-[1px] border-gray-400 dark:border-dark_primary_btn rounded-lg px-2 py-2')}
        />
      }
    </div>
  );
};

export default EditorInput;
