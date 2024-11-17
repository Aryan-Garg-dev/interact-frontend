import Navbar from '@/components/common/navbar';
import SearchBar from '@/components/explore/searchbar';
import { useWindowWidth } from '@react-hook/window-size';
import Head from 'next/head';
import React, { ReactNode, use } from 'react';

interface WrapperProps {
  children: ReactNode;
  title?: string;
  excludeSearchBar?: boolean;
}

const BaseWrapper: React.FC<WrapperProps> = ({ children, title = '', excludeSearchBar = false }) => {
  const width = useWindowWidth();
  const isMD = width < 768;
  return (
    <>
      <Head>
        <title>{title} | Interact</title>
      </Head>
      <Navbar includeExplore={isMD} />
      {!excludeSearchBar && !isMD && <SearchBar />}
      <div className="w-full flex">{children}</div>
    </>
  );
};

export default BaseWrapper;
