import { useTheme } from 'next-themes';
import React, { useState } from 'react';

const Theme = () => {
  const [inputTheme, setInputTheme] = useState(String(localStorage.getItem('theme')) == 'dark' ? 'dark' : 'light');

  const { setTheme } = useTheme();

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setInputTheme('light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setInputTheme('dark');
      setTheme('dark');
    }
  };
  return (
    <label className="w-full h-16 select-none text-xl flex-center gap-4 dark:bg-dark_primary_comp hover:bg-primary_comp active:bg-primary_comp_hover dark:hover:bg-dark_primary_comp dark:active:bg-dark_primary_comp_hover px-6 rounded-md text-center cursor-pointer transition-ease-300">
      <div className="capitalize">{inputTheme} Mode</div>
      <div className="relative">
        <input type="checkbox" onChange={toggleTheme} className="sr-only" />
        <div
          className={`box block h-8 w-14 rounded-full ${
            inputTheme == 'dark' ? 'bg-white' : 'bg-black'
          } transition-ease-300`}
        ></div>
        <div
          className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full ${
            inputTheme == 'dark' ? 'translate-x-full bg-black' : 'bg-white '
          } transition-ease-300`}
        ></div>
      </div>
    </label>
  );
};

export default Theme;
