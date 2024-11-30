import Navbar from '@/components/common/navbar';
import SearchBar from '@/components/explore/searchbar';
import { useWindowWidth } from '@react-hook/window-size';
import Head from 'next/head';
import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
  title?: string;
  excludeSearchBar?: boolean;
  seoProps?: ReactNode;
}

const BaseWrapper: React.FC<WrapperProps> = ({ children, title = '', excludeSearchBar = false, seoProps }) => {
  const width = useWindowWidth();
  const isMD = width < 768;

  return (
    <>
      <Head>
        <title>{title} | Interact</title>
      </Head>
      {seoProps ? (
        seoProps
      ) : (
        <Head>
          <meta
            name="description"
            content="Interact is a groundbreaking web platform designed for college-going students, freelancers, professionals, and creatives. It serves as a collaborative hub where users can upload their ongoing projects and connect with others who are interested in collaborating on those projects."
          />
          <meta
            name="keywords"
            content="Collaborative platform for projects, Project collaboration network, Online project collaboration, College student collaboration, Freelancer collaboration, Professional project sharing, Creative project collaboration, Collaborate on ongoing projects, Project collaboration hub, Project showcase platform, Collaborative networking for students, Collaborate with professionals, Collaborate with creatives, Free project collaboration, Showcase achievements online, Project collaboration for all niches, Connect with project partners, College project sharing, Networking for freelancers, Creative project sharing platform"
          />
          <meta property="og:title" content={`${title} | Interact`} />
          <meta
            property="og:description"
            content="Interact is a groundbreaking web platform designed for college-going students, freelancers, professionals, and creatives. It serves as a collaborative hub where users can upload their ongoing projects and connect with others who are interested in collaborating on those projects."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://interactnow.in/" />
          <meta property="og:site_name" content="Interact" />
          <meta property="og:image" content="https://i.imgur.com/oXPWynA.jpg" />
          <meta property="og:image:width" content="720" />
          <meta property="og:image:height" content="720" />
          <meta
            property="og:image:alt"
            content="Interact: The collaborative hub for project sharing and collaboration among college students, freelancers, professionals, and creatives."
          />
        </Head>
      )}
      <Navbar includeExplore={isMD} />
      {!excludeSearchBar && !isMD && <SearchBar />}
      <div className="w-full flex">{children}</div>
    </>
  );
};

export default BaseWrapper;
