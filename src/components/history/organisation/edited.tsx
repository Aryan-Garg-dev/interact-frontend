import { OrganizationHistory } from '@/types';
import OrganizationHistoryWrapper from '@/wrappers/organisation_history';
import { ArrowUpRight } from '@phosphor-icons/react';
import Link from 'next/link';
import React from 'react';

interface Props {
  history: OrganizationHistory;
}

const Edited = ({ history }: Props) => {
  switch (history.historyType) {
    case 2:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            Updated an Event:{' '}
            <Link target="_blank" href={'/explore/event/' + history.event?.id} className="font-semibold">
              {history.event?.title}
            </Link>{' '}
          </div>
        </OrganizationHistoryWrapper>
      );
    case 8:
      return (
        <OrganizationHistoryWrapper history={history}>
          <Link
            target="_blank"
            href={'/explore/post/' + history.post?.id}
            className="w-fit bg-priority_low px-1 rounded-md flex-center gap-2"
          >
            Updated a Post!
            <ArrowUpRight weight="bold" />
          </Link>
        </OrganizationHistoryWrapper>
      );
    case 11:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            Updated a Project:{' '}
            <Link target="_blank" href={'/explore/project/' + history.project?.slug} className="font-semibold">
              {history.project?.title}
            </Link>{' '}
          </div>
        </OrganizationHistoryWrapper>
      );
    case 14:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">Updated organization details </div>
        </OrganizationHistoryWrapper>
      );
    case 16:
    case 17:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            Updated Coordinators of the Event:{' '}
            <Link target="_blank" href={'/explore/event/' + history.eventID} className="font-semibold">
              {history.event?.title}
            </Link>{' '}
          </div>
        </OrganizationHistoryWrapper>
      );
    case 20:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            Edited a Poll:{' '}
            <Link target="_blank" href={'/organisation/news/'} className="font-semibold">
              {history.poll?.title}
            </Link>{' '}
          </div>
        </OrganizationHistoryWrapper>
      );
    case 23:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            Edited an Announcement:{' '}
            <Link target="_blank" href={'/explore/announcement/' + history.announcementID} className="font-semibold">
              {history.announcement?.title}
            </Link>{' '}
          </div>
        </OrganizationHistoryWrapper>
      );
    case 26:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            Edited an Opening:{' '}
            <Link target="_blank" href={'/explore?oid=' + history.openingID} className="font-semibold">
              {history.opening?.title}
            </Link>
          </div>
        </OrganizationHistoryWrapper>
      );
    case 30:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            Edited Memberships Details -{' '}
            <Link href={`/organisation/members`} className="font-semibold">
              {history.membership?.user?.name}
            </Link>
          </div>
        </OrganizationHistoryWrapper>
      );
    case 32:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            Edited a Resource Bucket:{' '}
            <Link target="_blank" href={'/organisation/resources'} className="font-semibold">
              {history.resourceBucket?.title}
            </Link>
          </div>
        </OrganizationHistoryWrapper>
      );
    case 35:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            Edited a Team:{' '}
            <Link target="_blank" href={'/organisation/members'} className="font-semibold">
              {history.team?.title}
            </Link>
          </div>
        </OrganizationHistoryWrapper>
      );
    case 40:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            Edited a Meeting:{' '}
            <Link target="_blank" href={'/organisation/meetings/' + history.meeting?.id} className="font-semibold">
              {history.team?.title}
            </Link>
          </div>
        </OrganizationHistoryWrapper>
      );
    default:
      return <></>;
  }
};

export default Edited;
