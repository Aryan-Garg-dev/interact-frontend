import React from 'react';
import Image from 'next/image';
import { Event, Meeting } from '@/types';
import Link from 'next/link';
import { EVENT_PIC_URL } from '@/config/routes';
import { Buildings, ClockCounterClockwise, Eye, PencilSimple, Trash, Users } from '@phosphor-icons/react';
import moment from 'moment';
import checkOrgAccess, { checkParticularOrgAccess } from '@/utils/funcs/check_org_access';
import { ORG_SENIOR } from '@/config/constants';

interface Props {
  meeting: Meeting;
  setMeetings?: React.Dispatch<React.SetStateAction<Meeting[]>>;
}

const MeetingCard = ({ meeting, setMeetings }: Props) => {
  return (
    <Link
      href={`/explore/event/${meeting.id}`}
      target="_blank"
      className="w-72 rounded-xl hover:shadow-xl transition-ease-out-500 animate-fade_third"
    >
      {meeting.title}
    </Link>
  );
};

export default MeetingCard;
