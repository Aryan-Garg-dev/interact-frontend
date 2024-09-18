import { HackathonHistory } from '@/types';
import HackathonHistoryWrapper from '@/wrappers/hackathon_history';
import Link from 'next/link';
import React from 'react';

interface Props {
  history: HackathonHistory;
}

const Deleted = ({ history }: Props) => {
  switch (history.historyType) {
    case 2:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_high px-1 rounded-md gap-4">
            <span className="">Deleted</span> an hackathon: <span className="font-semibold">{history.deletedText}</span>
          </div>
        </HackathonHistoryWrapper>
      );
    case 5:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_high px-1 rounded-md gap-4">
            Deleted a Track: <span className="font-semibold">{history.deletedText}</span>
          </div>
        </HackathonHistoryWrapper>
      );
    case 8:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_high px-1 rounded-md gap-4">
            Deleted a prize: <span className="font-semibold">{history.deletedText}</span>
          </div>
        </HackathonHistoryWrapper>
      );
    case 11:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_high px-1 rounded-md gap-4">
            Deleted a sponsor:<span className="font-semibold">{history.deletedText}</span>
          </div>
        </HackathonHistoryWrapper>
      );
    case 14:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_high px-1 rounded-md gap-4">
            Deleted a FAQ: <span className="font-semibold">{history.deletedText}</span>
          </div>
        </HackathonHistoryWrapper>
      );
    case 17:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_high px-1 rounded-md gap-4">
            Deleted a round: <span className="font-semibold">{history.deletedText}</span>
          </div>
        </HackathonHistoryWrapper>
      );
    case 19:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_high px-1 rounded-md gap-4">Removed a coordinator</div>
        </HackathonHistoryWrapper>
      );
    case 21:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_high px-1 rounded-md gap-4 line-clamp-1">
            Removed a judge: <span className="font-semibold">{history.deletedText}</span>
          </div>
        </HackathonHistoryWrapper>
      );
    default:
      return <></>;
  }
};

export default Deleted;
