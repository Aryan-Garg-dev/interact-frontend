import ConfirmDelete from '@/components/common/confirm_delete';
import Loader from '@/components/common/loader';
import OrgSidebar from '@/components/common/org_sidebar';
import PictureList from '@/components/common/picture_list';
import UsersList from '@/components/common/users_list';
import SessionDetailsTable from '@/components/tables/meetings/session_details';
import SessionTable from '@/components/tables/meetings/sessions';
import { ORG_SENIOR } from '@/config/constants';
import { SERVER_ERROR } from '@/config/errors';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import deleteHandler from '@/handlers/delete_handler';
import getHandler from '@/handlers/get_handler';
import EditMeeting from '@/sections/organization/meetings/edit_meeting';
import { currentOrgSelector } from '@/slices/orgSlice';
import { Session } from '@/types';
import { initialMeeting } from '@/types/initials';
import checkOrgAccess from '@/utils/funcs/check_org_access';
import { getNextSessionTime } from '@/utils/funcs/session_details';
import Toaster from '@/utils/toaster';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import { Pen, Trash } from '@phosphor-icons/react';
import moment from 'moment';
import Image from 'next/image';
import { GetServerSidePropsContext } from 'next/types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {
  id: string;
}

const Meeting = ({ id }: Props) => {
  const [meeting, setMeeting] = useState(initialMeeting);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Ended');
  const [clickedOnSession, setClickedOnSession] = useState(false);
  const [clickedSessionID, setClickedSessionID] = useState('');
  const [clickedOnParticipants, setClickedOnParticipants] = useState(false);
  const [clickedOnEdit, setClickedOnEdit] = useState(false);
  const [clickedOnDelete, setClickedOnDelete] = useState(false);

  const currentOrg = useSelector(currentOrgSelector);

  const getMeeting = async () => {
    const URL = `/org/${currentOrg.id}/meetings/${id}`;
    const res = await getHandler(URL);
    if (res.statusCode === 200) {
      setMeeting(res.data.meeting);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      }
      setLoading(false);
    }
  };

  const getSessions = async () => {
    const URL = `/org/${currentOrg.id}/meetings/sessions/${id}`;
    const res = await getHandler(URL);
    if (res.statusCode === 200) {
      setSessions(res.data.sessions);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      }
    }
  };

  const handleJoinMeeting = async () => {
    await getHandler(`/org/${currentOrg.id}/meetings/token/${id}`)
      .then(res => {
        if (res.statusCode === 200) {
          const authToken = res.data.authToken;
          window.location.assign('/organisation/meetings/live?mid=' + authToken);
        } else {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else {
            Toaster.error(SERVER_ERROR, 'error_toaster');
          }
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  useEffect(() => {
    const now = moment();
    setStatus(
      meeting.isLive
        ? 'Live'
        : moment(meeting.startTime).isBefore(now) && moment(meeting.endTime).isAfter(now)
        ? 'Idle'
        : meeting.frequency == 'none'
        ? moment(meeting.startTime).isBefore(now)
          ? 'Ended'
          : 'Scheduled'
        : 'Scheduled'
    );
  }, [meeting]);

  useEffect(() => {
    getMeeting();
    getSessions();
  }, []);

  const handleDelete = async () => {
    const toaster = Toaster.startLoad('Deleting Meeting...');

    const URL = `/org/${currentOrg.id}/meetings/${meeting.id}`;

    const res = await deleteHandler(URL);
    if (res.statusCode === 204) {
      setClickedOnDelete(false);
      Toaster.stopLoad(toaster, 'Meeting Deleted', 1);
      window.location.assign('/organisation/meetings');
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };

  return (
    <BaseWrapper title={`Meetings | ${currentOrg.title}`}>
      <OrgSidebar index={16} />
      <MainWrapper>
        <div className="w-full flex flex-col gap-4 p-base_padding">
          {
            //TODO back button
          }
          {clickedOnSession && <SessionDetailsTable sessionID={clickedSessionID} setShow={setClickedOnSession} />}
          {clickedOnParticipants && (
            <UsersList users={meeting.participants} title="Participants" setShow={setClickedOnParticipants} />
          )}
          {clickedOnEdit && <EditMeeting setShow={setClickedOnEdit} meeting={meeting} setMeeting={setMeeting} />}
          {clickedOnDelete && <ConfirmDelete handleDelete={handleDelete} setShow={setClickedOnDelete} />}
          {loading ? (
            <Loader />
          ) : (
            <div className="w-full flex flex-col gap-6">
              <div className="w-full flex flex-col gap-3">
                <div className="w-full flex flex-col gap-1">
                  <div className="w-full flex items-center justify-between flex-wrap">
                    <div className="text-4xl font-medium">{meeting.title}</div>
                    <div className="w-fit flex-center gap-4">
                      {checkOrgAccess(ORG_SENIOR) && (
                        <Pen onClick={() => setClickedOnEdit(true)} className="cursor-pointer" size={28} />
                      )}
                      {checkOrgAccess(ORG_SENIOR) && (
                        <Trash onClick={() => setClickedOnDelete(true)} className="cursor-pointer" size={28} />
                      )}
                      <button
                        disabled={status != 'Live' && status != 'Idle'}
                        onClick={handleJoinMeeting}
                        className="w-40 text-lg text-center font-medium px-4 py-2 bg-white disabled:hover:bg-white hover:bg-blue-50 active:bg-blue-100 text-primary_text transition-ease-500 rounded-lg cursor-pointer animate-fade_third disabled:opacity-50 disabled:hover:bg-primary_comp disabled:cursor-default"
                      >
                        {status == 'Live' || status == 'Idle' ? 'Join Meet' : 'Not Live'}
                      </button>
                    </div>
                  </div>
                  <div className="">{meeting.description}</div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {meeting.tags &&
                    meeting.tags.map(tag => {
                      return (
                        <div
                          key={tag}
                          className="flex-center px-2 py-1 font-primary text-xs dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg"
                        >
                          {tag}
                        </div>
                      );
                    })}
                </div>

                <div className="flex items-center gap-2">
                  Status:
                  <div
                    className={`text-sm px-2 py-1 ${
                      status == 'Live' ? 'bg-priority_low' : status == 'Ended' ? 'bg-priority_high' : 'bg-priority_mid'
                    } rounded-full `}
                  >
                    {status}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  Frequency:
                  <div
                    className={`w-fit text-sm px-2 py-1 ${
                      meeting.frequency == 'none' ? 'bg-blue-200' : 'bg-priority_mid'
                    } rounded-full capitalize`}
                  >
                    {meeting.frequency == 'none' ? 'One Time' : meeting.frequency}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  Status:
                  <div
                    className={`text-xs px-2 py-1 ${
                      meeting.isOpenForMembers ? 'bg-priority_low' : 'bg-priority_high'
                    } rounded-full `}
                  >
                    {meeting.isOpenForMembers ? 'Open for members' : 'Restricted'}
                  </div>
                  <div
                    className={`text-xs px-2 py-1 ${
                      meeting.allowExternalParticipants ? 'bg-priority_low' : 'bg-priority_high'
                    } rounded-full `}
                  >
                    {meeting.allowExternalParticipants
                      ? 'External Participants Allowed'
                      : 'External Participants Not Allowed'}
                  </div>
                </div>

                {meeting.frequency == 'none' ? (
                  <div className="flex flex-col gap-3">
                    <div>Start Time: {moment(meeting.startTime).format('hh:mm A, ddd MMM DD')}</div>
                    <div>Expected End Time: {moment(meeting.endTime).format('hh:mm A, ddd MMM DD')}</div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div>Next Session Start Time: {getNextSessionTime(meeting)}</div>
                    <div>Expected End Time: {getNextSessionTime(meeting, true)}</div>
                  </div>
                )}

                <div className="w-fit flex-center gap-1">
                  Scheduled by
                  <span className="flex-center gap-1 font-medium">
                    <Image
                      crossOrigin="anonymous"
                      width={200}
                      height={200}
                      alt={'User Pic'}
                      src={`${USER_PROFILE_PIC_URL}/${meeting.user?.profilePic}`}
                      className={'w-6 h-6 rounded-full object-cover'}
                    />
                    {meeting.user.name}
                  </span>
                  on
                  <span>{moment(meeting.createdAt).format('DD MMMM YYYY')}</span>
                </div>

                {meeting.participants && meeting.participants.length > 1 && (
                  <div className="w-fit flex-center gap-1">
                    Accepted Members:
                    <span
                      onClick={() => setClickedOnParticipants(true)}
                      className="flex-center gap-1 font-medium  cursor-pointer"
                    >
                      <PictureList users={meeting.participants} size={6} gap={3} />
                    </span>
                  </div>
                )}
              </div>
              {sessions && sessions.length > 0 && (
                <SessionTable
                  sessions={sessions}
                  setClickedOnSession={setClickedOnSession}
                  setClickedSessionID={setClickedSessionID}
                />
              )}
            </div>
          )}
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;

  return {
    props: { id },
  };
}

export default Meeting;
