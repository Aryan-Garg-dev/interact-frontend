import MenuBar from '@/components/common/menu_bar';
import Sidebar from '@/components/common/sidebar';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import PrimeWrapper from '@/wrappers/prime';
import SideBarWrapper, { SidePrimeWrapper } from '@/wrappers/side';
import React, { useState } from 'react';
import ExploreOpenings from '@/screens/openings/explore';
import BookmarkOpenings from '@/screens/openings/bookmarks';
import Applications from '@/screens/openings/applications';

const Openings = () => {
  const [active, setActive] = useState(0);
  return (
    <BaseWrapper title="Openings">
      <Sidebar index={5} />
      <MainWrapper sidebarLayout>
        <div className="w-full">
          <MenuBar items={['Explore', 'Applied', 'Saved']} active={active} setState={setActive} />
          {active == 0 ? (
            <PrimeWrapper index={0} maxIndex={2}>
              <ExploreOpenings />
            </PrimeWrapper>
          ) : active == 1 ? (
            <PrimeWrapper index={1} maxIndex={2}>
              <Applications />
            </PrimeWrapper>
          ) : (
            active == 2 && (
              <PrimeWrapper index={2} maxIndex={2}>
                <BookmarkOpenings />
              </PrimeWrapper>
            )
          )}
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Openings;
