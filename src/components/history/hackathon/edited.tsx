import { HackathonHistory } from '@/types';
import HackathonHistoryWrapper from '@/wrappers/hackathon_history';
import { ArrowUpRight } from '@phosphor-icons/react';
import Link from 'next/link';
import React from 'react';

interface Props {
  history: HackathonHistory;
}

const Edited = ({ history }: Props) => {
  switch (history.historyType) {
    case 1:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            Hackathon details updated:{' '}
            <Link target="_blank" href={'/organisation/events/' + history.hackathonID} className="font-semibold">
              {history.user.title}
            </Link>{' '}
          </div>
          : <div>{history.deletedText}</div>
        </HackathonHistoryWrapper>
      );
    case 4:
      return (
        <HackathonHistoryWrapper history={history}>
          <Link
            target="_blank"
            href={'/organisation/events/' + history.hackathonTrack.id}
            className="w-fit bg-priority_low px-1 rounded-md flex-center gap-2"
          >
            Track Updated!
            <ArrowUpRight weight="bold" />
          </Link>
        </HackathonHistoryWrapper>
      );
    case 7:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            Prize Updated:{' '}
            <Link target="_blank" href={'/organisation/events/' + history.hackathonPrizeID} className="font-semibold">
              {history.hackathonPrize.title}
            </Link>{' '}
          </div>
          : <div>{history.deletedText}</div>
        </HackathonHistoryWrapper>
      );
    case 10:
        return (
            <HackathonHistoryWrapper history={history}>
              <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
                Sponsor Updated:{' '}
                <Link target="_blank" href={'/organisation/events/' + history.hackathonSponsorID} className="font-semibold">
                  {history.hackathonSponsor.title}
                </Link>{' '}
              </div>
              : <div>{history.deletedText}</div>
            </HackathonHistoryWrapper>
          );
    case 13:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            FAQ Updated:{' '}
            <Link target="_blank" href={'/organisation/events/' + history.hackathonFAQID} className="font-semibold">
            </Link>{' '}
          </div>
        </HackathonHistoryWrapper>
      );
    case 16:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            Round updated:{' '}
            <Link target="_blank" href={'/organisation/events/'} className="font-semibold">
              {history.hackathonRoundID}
            </Link>{' '}
          </div>
        </HackathonHistoryWrapper>
      );
    default:
      return <></>;
  }
};

export default Edited;
