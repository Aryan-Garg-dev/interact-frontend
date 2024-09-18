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
            Hackathon created:{' '}
            <Link target="_blank" href={'/organisation/events/' + history.hackathonID} className="font-semibold">
              {history.user.title}
            </Link>{' '}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 3:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            Added Tracks:
            <Link
              target="_blank"
              href={'/organisation/events/' + history.hackathonTrack.id}
              className="font-semibold"
            >
              {history.hackathonTrack.title}
            </Link>{' '}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 6:
      return (
        <HackathonHistoryWrapper history={history}>
          <Link
            target="_blank"
            href={'/organisation/events/' + history.hackathonPrizeID}
            className="w-fit bg-priority_low px-1 rounded-md flex-center gap-2"
          >
            Prize Added:
            <ArrowUpRight weight="bold" />
          </Link>
        </HackathonHistoryWrapper>
      );
    case 9:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            Sponsor Added:{' '}
            <Link target="_blank" href={'/organisation/events/' + history.hackathonSponsorID} className="font-semibold">
            </Link>{' '}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 12:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            FAQ Added:{' '}
            <Link target="_blank" href={'/organisation/events/'} className="font-semibold">
              {history.hackathonFAQID}
            </Link>{' '}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 15:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            Round Added:{' '}
            <Link target="_blank" href={'/organisation/events/'} className="font-semibold">
              {history.hackathonRoundID}
            </Link>{' '}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 18:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            Coordinator Added:{' '}
            <Link target="_blank" href={'/organisation/events/' + history.coordinators} className="font-semibold">
            </Link>{' '}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 20:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            Judge Invited:{' '}
            <Link target="_blank" href={'/organisation/events/' + history.judges} className="font-semibold">
            </Link>{' '}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    case 22:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_low px-1 rounded-md gap-4">
            Team Created:{' '}
            <Link
              target="_blank"
              href={'/organisation/events/' + history.hackathonTeamID}
              className="font-semibold"
            >
              {history.hackathonTeam.title}
            </Link>{' '}
            🎉
          </div>
        </HackathonHistoryWrapper>
      );
    default:
      return <></>;
  }
};

export default Created;