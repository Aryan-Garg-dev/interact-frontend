import Navbar from '@/components/common/navbar';
import SearchBar from '@/components/explore/searchbar';
import Head from 'next/head';
import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
  title?: string;
  excludeSearchBar?: boolean;
}

const BaseWrapper: React.FC<WrapperProps> = ({ children, title = '', excludeSearchBar = false }) => {
  return (
    <>
      <Head>
        <title>{title} | Interact</title>
      </Head>
      <Navbar />
      {!excludeSearchBar && <SearchBar />}
      <div className="w-full flex">{children}</div>
    </>
  );
};

export default BaseWrapper;
