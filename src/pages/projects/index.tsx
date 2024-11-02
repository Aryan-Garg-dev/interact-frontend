import MenuBar from '@/components/common/menu_bar';
import Sidebar from '@/components/common/sidebar';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import PrimeWrapper from '@/wrappers/prime';
import SideBarWrapper, { SidePrimeWrapper } from '@/wrappers/side';
import React, { useState } from 'react';
import ExploreProjects from '@/screens/projects/explore';
import BookmarkProjects from '@/screens/projects/bookmarks';
import CombinedProjects from '@/screens/projects/workspace';

const Projects = () => {
  const [active, setActive] = useState(0);
  return (
    <BaseWrapper title="Projects">
      <Sidebar index={2} />
      <MainWrapper sidebarLayout>
        <div className="w-2/3">
          <MenuBar items={['Explore', 'Workspace', 'Saved']} active={active} setState={setActive} />
          {active == 0 ? (
            <PrimeWrapper index={0} maxIndex={2}>
              <ExploreProjects />
            </PrimeWrapper>
          ) : active == 1 ? (
            <PrimeWrapper index={1} maxIndex={2}>
              <CombinedProjects />
            </PrimeWrapper>
          ) : (
            active == 2 && (
              <PrimeWrapper index={2} maxIndex={2}>
                <BookmarkProjects />
              </PrimeWrapper>
            )
          )}
        </div>
        <SideBarWrapper>
          <SidePrimeWrapper>Top 10 list, etc</SidePrimeWrapper>
          <SidePrimeWrapper>This section to promote new projects</SidePrimeWrapper>
        </SideBarWrapper>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Projects;
