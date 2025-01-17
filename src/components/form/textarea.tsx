import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  value = '',
  onChange,
  required = false,
  maxLength,
  showCount = true,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <div className="text-xs ml-1 font-medium uppercase text-gray-500 dark:text-gray-300">
          {label}
          {required && ' *'}
          {showCount && maxLength && ` (${value.length}/${maxLength})`}
        </div>
      )}
      <textarea
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
        {...props}
      />
    </div>
  );
};

export default TextArea;
