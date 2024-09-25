import React, { useState } from 'react';
import BottomBarItem from './bottombar_item';
import {
  RocketLaunch,
  Wrench,
  BookOpenText,
  IdentificationCard,
  NoteBlank,
  Ticket,
  VideoConference,
} from '@phosphor-icons/react';

interface Props {
  index: number;
}

const OrgBottomBar = ({ index }: Props) => {
  const [active, setActive] = useState(index);

  return (
    <div className="w-full h-bottomBar flex justify-evenly items-center bg-white dark:bg-transparent backdrop-blur-xl backdrop-brightness-150 fixed bottom-0 right-0 lg:hidden border-gray-300 border-t-[1px] z-[20]">
      <BottomBarItem
        index={2}
        title="Posts"
        icon={<NoteBlank size={24} />}
        active={active}
        setActive={setActive}
        org={true}
      />
      <BottomBarItem
        index={3}
        title="Projects"
        icon={<RocketLaunch size={24} />}
        active={active}
        setActive={setActive}
        org={true}
      />
      <BottomBarItem
        index={12}
        title="Events"
        icon={<Ticket size={24} />}
        active={active}
        setActive={setActive}
        org={true}
      />
      <BottomBarItem
        index={4}
        title="Tasks"
        icon={<Wrench size={24} />}
        active={active}
        setActive={setActive}
        org={true}
      />
      <BottomBarItem
        index={6}
        title="Members"
        icon={<IdentificationCard size={24} />}
        active={active}
        setActive={setActive}
        org={true}
      />
      <BottomBarItem
        index={14}
        title="Resources"
        icon={<BookOpenText size={24} />}
        active={active}
        setActive={setActive}
        org={true}
      />
      <BottomBarItem
        index={16}
        title="Meetings"
        icon={<VideoConference size={24} />}
        active={active}
        setActive={setActive}
        org={true}
      />
    </div>
  );
};

export default OrgBottomBar;
