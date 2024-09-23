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
            created a Hackathon:{history.hackathonID}
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
           Added Prize: {history.hackathonPrize.amount} 🎉
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
            Added a Round:{history.hackathonRound.id}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 18:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            Added Coordinator: 
            {history.coordinators.map((coordinator, index) => (
              <span key={index}>{coordinator.name}{index < history.coordinators.length - 1 ? ', ' : ''}</span>
            ))}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 20:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            Added Coordinator: 
            {history.judges.map((judge, index) => (
              <span key={index}>{judge.name}{index < history.judges.length - 1 ? ', ' : ''}</span>
            ))}
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