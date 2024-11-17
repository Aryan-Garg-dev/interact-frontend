import MenuBar from '@/components/common/menu_bar';
import Sidebar from '@/components/common/sidebar';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import PrimeWrapper from '@/wrappers/prime';
import SideBarWrapper from '@/wrappers/side';
import React, { useState } from 'react';
import Discover from '@/screens/home/discover';
import Feed from '@/screens/home/feed';
import FeedSide from '@/sides/home/feed';
import CommunitySide from '@/sides/home/community';
import Communities from '@/screens/home/communities';
import { useSelector } from 'react-redux';
import { userIDSelector } from '@/slices/userSlice';

const Home = () => {
  const [active, setActive] = useState(0);
  const userID = useSelector(userIDSelector);

  return (
    <BaseWrapper title="Home">
      <Sidebar index={1} />
      <MainWrapper restrictWidth sidebarLayout>
        <div className="w-2/3 max-md:w-full">
          <MenuBar
            items={userID ? ['Explore', 'Following', 'Communities'] : ['Explore', 'Communities']}
            active={active}
            setState={setActive}
          />
          {active == 0 ? (
            <PrimeWrapper index={0} maxIndex={2}>
              <Discover />
            </PrimeWrapper>
          ) : active == 1 ? (
            <PrimeWrapper index={1} maxIndex={2}>
              {userID ? <Feed /> : <Communities />}
            </PrimeWrapper>
          ) : (
            active == 2 && (
              <PrimeWrapper index={2} maxIndex={2}>
                <Communities />
              </PrimeWrapper>
            )
          )}
        </div>
        <SideBarWrapper>{active == 0 || active == 1 ? <FeedSide /> : active == 2 && <CommunitySide />}</SideBarWrapper>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Home;
