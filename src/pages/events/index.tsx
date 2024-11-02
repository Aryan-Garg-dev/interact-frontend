import MenuBar from '@/components/common/menu_bar';
import Sidebar from '@/components/common/sidebar';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import PrimeWrapper from '@/wrappers/prime';
import SideBarWrapper, { SidePrimeWrapper } from '@/wrappers/side';
import React, { useState } from 'react';
import ExploreEvents from '@/screens/explore/events';
import BookmarkEvents from '@/screens/bookmarks/events';
import RegisteredEvents from '@/screens/events/registered';

const Events = () => {
  const [active, setActive] = useState(0);
  return (
    <BaseWrapper title="Events">
      <Sidebar index={3} />
      <MainWrapper sidebarLayout restrictWidth>
        <div className="w-2/3">
          <MenuBar items={['Explore', 'Registered', 'Saved']} active={active} setState={setActive} />
          {active == 0 ? (
            <PrimeWrapper index={0} maxIndex={2}>
              <ExploreEvents />
            </PrimeWrapper>
          ) : active == 1 ? (
            <PrimeWrapper index={1} maxIndex={2}>
              <RegisteredEvents />
            </PrimeWrapper>
          ) : (
            active == 2 && (
              <PrimeWrapper index={2} maxIndex={2}>
                <BookmarkEvents />
              </PrimeWrapper>
            )
          )}
        </div>
        <SideBarWrapper>
          <SidePrimeWrapper>Top 10 list, etc</SidePrimeWrapper>
          <SidePrimeWrapper>This section to promote new events</SidePrimeWrapper>
        </SideBarWrapper>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Events;
