import React, { useState } from 'react';
import BottomBarItem from './bottombar_item';
import { HouseLine, RocketLaunch, Wrench, Envelope, BookmarkSimple } from '@phosphor-icons/react';

interface Props {
  index: number;
}

const BottomBar = ({ index }: Props) => {
  const [active, setActive] = useState(index);

  return (
    <div className="w-full h-bottomBar flex justify-evenly items-center bg-white dark:bg-transparent backdrop-blur-xl backdrop-brightness-150 fixed bottom-0 right-0 lg:hidden border-gray-300 border-t-[1px] z-[20]">
      <BottomBarItem index={1} title="Home" icon={<HouseLine size={32} />} active={active} setActive={setActive} />
      <BottomBarItem
        index={2}
        title="Explore"
        icon={<RocketLaunch size={32} />}
        active={active}
        setActive={setActive}
      />
      <BottomBarItem index={3} title="Workspace" icon={<Wrench size={32} />} active={active} setActive={setActive} />
      <BottomBarItem
        index={5}
        title="Invitations"
        icon={<Envelope size={32} />}
        active={active}
        setActive={setActive}
      />
      <BottomBarItem
        index={6}
        title="Bookmarks"
        icon={<BookmarkSimple size={32} />}
        active={active}
        setActive={setActive}
      />
    </div>
  );
};

export default BottomBar;
