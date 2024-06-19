import React, { useEffect, useState } from 'react';
import { Meeting } from '@/types';
import Link from 'next/link';
import moment from 'moment';
import { getNextSessionTime } from '@/utils/funcs/session_details';

interface Props {
  meeting: Meeting;
  setMeetings?: React.Dispatch<React.SetStateAction<Meeting[]>>;
}

const MeetingCard = ({ meeting, setMeetings }: Props) => {
  const [status, setStatus] = useState('Ended');
  useEffect(() => {
    const now = moment();
    setStatus(
      meeting.isLive || (moment(meeting.startTime).isBefore(now) && moment(meeting.endTime).isAfter(now))
        ? 'Live'
        : meeting.frequency == 'none'
        ? moment(meeting.startTime).isBefore(now)
          ? 'Ended'
          : 'Scheduled'
        : 'Scheduled'
    );
  }, []);

  return (
    <Link
      href={'/organisation/meetings/' + meeting.id}
      className="w-full flex gap-1 bg-white py-4 rounded-lg hover:shadow-xl transition-ease-out-500 animate-fade_third p-2"
    >
      <div className="w-1/6 line-clamp-1 flex-center">{meeting.title}</div>
      <div className="w-1/6 flex-center">
        <div
          className={`text-xs px-2 py-1 ${
            status == 'Live' ? 'bg-priority_low' : status == 'Ended' ? 'bg-priority_high' : 'bg-priority_mid'
          } rounded-full `}
        >
          {status}
        </div>
      </div>
      <div className="w-1/6 flex-center">
        {meeting.tags.length > 0 && (
          <div className="w-full flex flex-wrap gap-1">
            {meeting.tags &&
              meeting.tags // Splicing causes array mutation
                .filter((_, index) => {
                  return index >= 0 && index < 3;
                })
                .map(tag => {
                  return (
                    <div
                      key={tag}
                      className="flex-center px-2 py-1 font-primary text-xs dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg"
                    >
                      {tag}
                    </div>
                  );
                })}
            {meeting.tags.length - 3 > 0 && (
              <div className="flex-center px-2 py-1 font-primary text-xs dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg">
                +{meeting.tags.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="w-1/6 flex-center">
        <div
          className={`text-xs px-2 py-1 ${
            meeting.frequency == 'none' ? 'bg-blue-200' : 'bg-priority_mid'
          } rounded-full capitalize`}
        >
          {meeting.frequency == 'none' ? 'One Time' : meeting.frequency}
        </div>
      </div>
      <div className="w-1/6 flex-center">
        <div
          className={`text-xs px-2 py-1 ${
            meeting.isOpenForMembers ? 'bg-priority_low' : 'bg-priority_high'
          } rounded-full `}
        >
          {meeting.isOpenForMembers ? 'Open for members' : 'Restricted'}
        </div>
      </div>
      <div className="w-1/6 text-sm flex-center flex-col">
        {meeting.isLive ? (
          'Session is live'
        ) : (
          <>
            <div className="text-xs">
              {status == 'Live'
                ? 'Started At'
                : meeting.frequency == 'none'
                ? status == 'Scheduled'
                  ? 'Scheduled on'
                  : 'Held on'
                : 'Next Session on'}
            </div>
            <div>{getNextSessionTime(meeting)}</div>
          </>
        )}
      </div>
    </Link>
  );
};

export default MeetingCard;
