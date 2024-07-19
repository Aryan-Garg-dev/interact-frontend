import React, { useState } from 'react';

const Theme = () => {
  const [theme, setTheme] = useState(String(localStorage.getItem('theme')) == 'dark' ? 'dark' : 'light');

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };
  return (
    <label className="w-full h-16 select-none text-xl flex-center gap-4 dark:bg-dark_primary_comp hover:bg-primary_comp active:bg-primary_comp_hover dark:hover:bg-dark_primary_comp dark:active:bg-dark_primary_comp_hover px-6 rounded-md text-center cursor-pointer transition-ease-300">
      <div className="capitalize">{theme} Mode</div>
      <div className="relative">
        <input type="checkbox" onChange={toggleTheme} className="sr-only" />
        <div
          className={`box block h-8 w-14 rounded-full ${theme == 'dark' ? 'bg-white' : 'bg-black'} transition-ease-300`}
        ></div>
        <div
          className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full ${
            theme == 'dark' ? 'translate-x-full bg-black' : 'bg-white '
          } transition-ease-300`}
        ></div>
      </div>
    </label>
  );
};

export default Theme;
