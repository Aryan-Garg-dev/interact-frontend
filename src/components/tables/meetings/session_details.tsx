import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import { currentOrgSelector } from '@/slices/orgSlice';
import { Session, User } from '@/types';
import Toaster from '@/utils/toaster';
import ModalWrapper from '@/wrappers/modal';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../common/loader';
import moment from 'moment';
import { ChatCenteredDots, FunnelSimple, Subtitles } from '@phosphor-icons/react';
import ToolTip from '../../utils/tooltip';
import Link from 'next/link';
import { getParticipationDuration } from '@/utils/funcs/session_details';

interface Props {
  sessionID: string;
  session: Session;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Participant {
  user: User;
  joined_at: Date;
  left_at: Date;
  duration: number;
  role: string;
}

const SessionDetailsTable = ({ sessionID, session, setShow }: Props) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [isChatLinkExpired, setIsChatLinkExpired] = useState(false);
  const [isTranscriptLinkExpired, setIsTranscriptLinkExpired] = useState(false);

  const currentOrg = useSelector(currentOrgSelector);

  const fetchParticipants = async () => {
    const URL = `/org/${currentOrg.id}/meetings/details/${sessionID}?page=${page}&limit=20&type=participants`;
    const res = await getHandler(URL);
    if (res.statusCode === 200) {
      setParticipants(res.data.participants || []);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      }
    }
  };

  useEffect(() => {
    setPage(1);
    setParticipants([]);
    fetchParticipants();

    if (!session?.isLive) {
      const now = moment.now();
      setIsChatLinkExpired(moment(now).isAfter(session.chatDownloadURLExpiry));
      setIsTranscriptLinkExpired(moment(now).isAfter(session.transcriptDownloadURLExpiry));
    }
  }, [sessionID]);

  return (
    <ModalWrapper setShow={setShow} width={'2/3'} blur={true}>
      <div className="w-full flex items-center gap-4 py-2">
        <div className="text-3xl font-semibold">Session Details</div>
        {session?.isLive ? (
          <div className="marker:w-fit text-sm px-2 py-1 bg-priority_low rounded-full">Session is Live!</div>
        ) : (
          session && (
            <div className="flex items-center gap-4">
              <div className="relative group">
                <ToolTip
                  styles={{
                    fontSize: '10px',
                    padding: '4px',
                    width: '128px',
                    top: '-30px',
                    left: '50%',
                    translate: '-50% 0',
                  }}
                  content={
                    session.chatDownloadURL != ''
                      ? !isChatLinkExpired
                        ? 'Download Chats'
                        : 'Expired'
                      : 'Not Available'
                  }
                />
                {session.chatDownloadURL != '' && !isChatLinkExpired ? (
                  <Link href={session.chatDownloadURL}>
                    <ChatCenteredDots size={32} weight="duotone" />
                  </Link>
                ) : (
                  <div className="cursor-default opacity-50">
                    <ChatCenteredDots size={32} weight="duotone" />
                  </div>
                )}
              </div>
              <div className="relative group">
                <ToolTip
                  styles={{
                    fontSize: '10px',
                    padding: '4px',
                    width: '128px',
                    top: '-30px',
                    left: '50%',
                    translate: '-50% 0',
                  }}
                  content={
                    session.transcriptDownloadURL != ''
                      ? !isTranscriptLinkExpired
                        ? 'Download Transcript'
                        : 'Expired'
                      : 'Not Available'
                  }
                />
                {session.transcriptDownloadURL != '' && !isTranscriptLinkExpired ? (
                  <Link href={session.transcriptDownloadURL}>
                    <Subtitles size={32} weight="duotone" />
                  </Link>
                ) : (
                  <div className="cursor-default opacity-50">
                    <Subtitles size={32} weight="duotone" />
                  </div>
                )}
              </div>
              {/* <div className="relative group">
         <ToolTip
           styles={{
             fontSize: '10px',
             padding: '4px',
             width: '128px',
             top: '-30px',
             left: '50%',
             translate: '-50% 0',
           }}
           content="Download Summary"
         />
         <FunnelSimple
           onClick={() => handleGetDownloadLink('summary')}
           size={32}
           weight="bold"
           className="cursor-pointer"
         />
       </div> */}
            </div>
          )
        )}
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full flex flex-col gap-2">
          <div className="w-full h-12 bg-slate-200 rounded-xl border-gray-400 flex font-semibold text-primary_black">
            <div className="w-1/3 flex-center">Name</div>
            <div className="w-1/6 flex-center">Joined At</div>
            <div className="w-1/6 flex-center">Left At</div>
            <div className="w-1/6 flex-center">Duration</div>
            <div className="w-1/6 flex-center">Role</div>
          </div>
          {participants.map(participant => (
            //TODO add pagination
            <div
              key={participant.user.id}
              className="w-full h-12 bg-slate-100 rounded-xl border-gray-400 flex text-sm text-primary_black"
            >
              <div className="w-1/3 flex-center">{participant.user.name}</div>
              <div className="w-1/6 flex-center">{moment(participant.joined_at).format('hh:mm:ss A')}</div>
              <div className="w-1/6 flex-center">{moment(participant.left_at).format('hh:mm:ss A')}</div>
              <div className="w-1/6 flex-center">
                {getParticipationDuration(participant.joined_at, participant.left_at)}
              </div>
              <div className="w-1/6 flex-center capitalize">{participant.role.replace('group_call_', '')}</div>
            </div>
          ))}
        </div>
      )}
    </ModalWrapper>
  );
};

export default SessionDetailsTable;
