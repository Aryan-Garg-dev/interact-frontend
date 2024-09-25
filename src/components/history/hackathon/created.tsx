import Hackathon from '@/screens/hackathon/hackathon';
import HackathonHistories from '@/sections/organization/hackathons/history';
import { HackathonHistory } from '@/types';
import HackathonHistoryWrapper from '@/wrappers/hackathon_history';
import { ArrowUpRight } from '@phosphor-icons/react';
import Link from 'next/link';
import React from 'react';

interface Props {
  history: HackathonHistory;
}

const Created = ({ history }: Props) => {
  switch (history.historyType) {
    case 0:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            created a Hackathon:{' '}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 3:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
          Added a Track: {history.hackathonTrack.title} 🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 6:
      return (
        <HackathonHistoryWrapper history={history}>
           <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
           Added Prize: {history.hackathonPrize.title} 🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 9:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            Added a Sponsor:{history.hackathonSponsor.name}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 12:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            Added a FAQ:{history.hackathonFAQ.question}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 15:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            Added a Round:{history.hackathonRound.index}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 18:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            Added a Coordinator:{history.user.name}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 20:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            Added a Judge:{history.user.name}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 22:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
          Created a Team:{history.hackathonTeam.title}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    default:
      return <></>;
  }
};

export default Created;