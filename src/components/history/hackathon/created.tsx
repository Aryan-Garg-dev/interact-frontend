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
            Added Tracks:
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 6:
      return (
        <HackathonHistoryWrapper history={history}>
           <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            Added Prize:
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 9:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            Added a Sponsor:{' '}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 12:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            Added a FAQ:{' '}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 15:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            Added a Round:{' '}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 18:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            Added a Coordinator:{' '}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 20:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
          Invited a Judge:{' '}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 22:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
          Created a Team:{' '}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    default:
      return <></>;
  }
};

export default Created;