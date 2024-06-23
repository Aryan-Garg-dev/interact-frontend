import { Session } from '@/types';
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
            setClickedSessionID(session.id);
            setClickedOnSession(true);
          }}
          className="w-full h-12 bg-white hover:bg-slate-100 rounded-xl border-gray-400 flex text-sm text-primary_black cursor-pointer transition-ease-300"
        >
          <div className="w-[30%] flex-center">{session.id}</div>
          <div className="w-[30%] flex-center">{moment(session.startedAt).format('hh:mm A, dddd DD MMMM')}</div>
          <div className="w-[30%] flex-center">{moment(session.endedAt).format('hh:mm A, dddd DD MMMM')}</div>
          <div className="w-[10%] flex-center"></div>
        </div>
      ))}
    </div>
  );
};

export default SessionTable;
