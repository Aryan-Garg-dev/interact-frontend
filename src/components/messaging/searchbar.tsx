import { MagnifyingGlass } from '@phosphor-icons/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSubmit = (el: React.FormEvent<HTMLFormElement>) => {
    el.preventDefault();
    if (search.trim() != '') router.push(`/messaging?search=${search}`);
    else router.push(`/messaging`);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-lg:w-taskbar_md h-10 px-4 py-2 flex items-center justify-between gap-8 mx-auto rounded-md shadow-md dark:shadow-outer bg-white dark:bg-gradient-to-b dark:from-dark_primary_gradient_start dark:to-dark_primary_gradient_end"
    >
      <input
        className="h-full grow bg-transparent focus:outline-none font-primary dark:text-white font-medium"
        type="text"
        placeholder="Search"
        value={search}
        onChange={el => setSearch(el.target.value)}
      />
      <MagnifyingGlass size={32} className="text-gray-600 dark:text-white opacity-75" />
    </form>
  );
};

export default SearchBar;
