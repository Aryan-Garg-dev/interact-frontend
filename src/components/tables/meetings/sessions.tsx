import { ORG_MEMBER, ORG_SENIOR } from '@/config/constants';
import { Session } from '@/types';
import checkOrgAccess from '@/utils/funcs/check_org_access';
import moment from 'moment';
import React from 'react';

interface Props {
  sessions: Session[];
  setClickedOnSession: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedSessionID: React.Dispatch<React.SetStateAction<string>>;
}

const SessionTable = ({ sessions, setClickedOnSession, setClickedSessionID }: Props) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="text-3xl font-semibold my-2">Sessions</div>
      <div className="w-full h-12 bg-white rounded-xl border-gray-400 flex font-semibold text-primary_black">
        <div className="w-[30%] flex-center">ID</div>
        <div className="w-[30%] flex-center">Started At</div>
        <div className="w-[30%] flex-center">Ended At</div>
        <div className="w-[10%] flex-center"></div>
      </div>
      {sessions.map(session => (
        <div
          key={session.id}
          onClick={() => {
            if (checkOrgAccess(ORG_MEMBER)) {
              setClickedSessionID(session.id);
              setClickedOnSession(true);
            }
          }}
          className={`w-full h-12 bg-white rounded-xl border-gray-400 flex text-sm text-primary_black ${
            checkOrgAccess(ORG_MEMBER) ? 'hover:bg-slate-100 cursor-pointer' : 'cursor-default'
          } transition-ease-300`}
        >
          <div className="w-[30%] flex-center">{session.id}</div>
          <div className="w-[30%] flex-center">{moment(session.startedAt).format('hh:mm A, dddd DD MMMM')}</div>
          <div className="w-[30%] flex-center">
            {session.isLive ? (
              <div className="w-fit text-sm px-2 py-1 bg-priority_low rounded-full">Session is Live!</div>
            ) : (
              moment(session.endedAt).format('hh:mm A, dddd DD MMMM')
            )}
          </div>
          <div className="w-[10%] flex-center"></div>
        </div>
      ))}
    </div>
  );
};

export default SessionTable;
