import ConfirmDelete from '@/components/common/confirm_delete';
import Loader from '@/components/common/loader';
import OrgSidebar from '@/components/common/org_sidebar';
import PictureList from '@/components/common/picture_list';
import Tags from '@/components/common/tags';
import SessionDetailsTable from '@/components/tables/meetings/session_details';
import SessionTable from '@/components/tables/meetings/sessions';
import { ORG_SENIOR } from '@/config/constants';
import { SERVER_ERROR } from '@/config/errors';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import deleteHandler from '@/handlers/delete_handler';
import getHandler from '@/handlers/get_handler';
import AddMeetingParticipants from '@/sections/organization/meetings/add_participants';
import EditMeeting from '@/sections/organization/meetings/edit_meeting';
import ParticipantsList from '@/sections/organization/meetings/view_participants';
import { currentOrgSelector } from '@/slices/orgSlice';
import { userSelector } from '@/slices/userSlice';
import { Session } from '@/types';
import { initialMeeting } from '@/types/initials';
import checkOrgAccess from '@/utils/funcs/check_org_access';
import renderContentWithLinks from '@/utils/funcs/render_content_with_links';
import { getNextSessionTime } from '@/utils/funcs/session_details';
import Toaster from '@/utils/toaster';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import { ArrowLeft, Pen, Trash } from '@phosphor-icons/react';
import moment from 'moment';
import Image from 'next/image';
import { GetServerSidePropsContext } from 'next/types';
import React, { ReactNode, useEffect, useState } from 'react';
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
  const [clickedOnViewParticipants, setClickedOnViewParticipants] = useState(false);
  const [clickedOnAddParticipants, setClickedOnAddParticipants] = useState(false);
  const [clickedOnEdit, setClickedOnEdit] = useState(false);
  const [clickedOnDelete, setClickedOnDelete] = useState(false);

  const user = useSelector(userSelector);
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

  interface BlockProps {
    label: string;
    child: ReactNode;
    alignEnd?: boolean;
  }

  const Block = ({ label, child, alignEnd = false }: BlockProps) => (
    <div className={`flex flex-col ${alignEnd && 'items-end'} gap-1`}>
      <div className="text-sm font-medium uppercase text-gray-700">{label}</div>
      {child}
    </div>
  );

  return (
    <BaseWrapper title={`Meetings | ${currentOrg.title}`}>
      <OrgSidebar index={16} />
      <MainWrapper>
        <div className="w-full flex flex-col gap-4 p-base_padding">
          {clickedOnSession && (
            <SessionDetailsTable
              sessionID={clickedSessionID}
              session={sessions.filter(session => session.id == clickedSessionID)[0]}
              setShow={setClickedOnSession}
            />
          )}
          {clickedOnAddParticipants ? (
            <AddMeetingParticipants meeting={meeting} setMeeting={setMeeting} setShow={setClickedOnAddParticipants} />
          ) : (
            clickedOnViewParticipants && (
              <ParticipantsList
                meeting={meeting}
                title="Participants"
                setShow={setClickedOnViewParticipants}
                setClickedOnAddParticipants={setClickedOnAddParticipants}
                setMeeting={setMeeting}
              />
            )
          )}
          {clickedOnEdit && <EditMeeting setShow={setClickedOnEdit} meeting={meeting} setMeeting={setMeeting} />}
          {clickedOnDelete && <ConfirmDelete handleDelete={handleDelete} setShow={setClickedOnDelete} />}
          {loading ? (
            <Loader />
          ) : (
            <div className="w-full flex flex-col gap-6">
              <div className="w-full flex flex-col gap-6">
                <div className="w-full flex flex-col gap-1">
                  <div className="w-full flex items-center justify-between flex-wrap mb-4">
                    <div className="flex-center gap-2">
                      {/*
                      //TODO back button
                      <ArrowLeft size={24} /> */}
                      <div className="text-5xl font-semibold">{meeting.title}</div>
                    </div>
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
                  <div className="flex items-center gap-2">
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
                </div>

                <div className="w-full flex flex-col gap-2">
                  <div className="">{renderContentWithLinks(meeting.description)}</div>
                  {meeting.tags && <Tags tags={meeting.tags} />}
                </div>

                <div className="w-108 flex items-center justify-between">
                  <Block
                    label="Status"
                    child={
                      <div
                        className={`w-fit text-sm px-2 py-1 ${
                          status == 'Live'
                            ? 'bg-priority_low'
                            : status == 'Ended'
                            ? 'bg-priority_high'
                            : 'bg-priority_mid'
                        } rounded-full `}
                      >
                        {status}
                      </div>
                    }
                  />
                  <Block
                    label="Frequency"
                    child={
                      <div
                        className={`w-fit text-sm px-2 py-1 ${
                          meeting.frequency == 'none' ? 'bg-blue-200' : 'bg-priority_mid'
                        } rounded-full capitalize`}
                      >
                        {meeting.frequency == 'none' ? 'One Time' : meeting.frequency}
                      </div>
                    }
                    alignEnd={true}
                  />
                </div>

                <div className="w-108 flex items-center justify-between">
                  {meeting.frequency == 'none' ? (
                    <>
                      <Block
                        label="Start Time"
                        child={<div>{moment(meeting.startTime).format('hh:mm A, ddd MMM DD')}</div>}
                      />
                      <Block
                        label="Expected End Time"
                        child={<div>{moment(meeting.endTime).format('hh:mm A, ddd MMM DD')}</div>}
                        alignEnd={true}
                      />
                    </>
                  ) : (
                    <>
                      <Block label="Next Session Start Time" child={<div>{getNextSessionTime(meeting)}</div>} />
                      <Block
                        label="Expected End Time"
                        child={<div>{getNextSessionTime(meeting, true)}</div>}
                        alignEnd={true}
                      />
                    </>
                  )}
                </div>
                <Block
                  label="Scheduled by"
                  child={
                    <div className="w-fit flex-center gap-1 mt-1">
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
                  }
                />

                {(!meeting.isOpenForMembers || meeting.allowExternalParticipants) && (
                  <div className="w-fit flex flex-col gap-1">
                    <div className="text-sm font-medium uppercase text-gray-700">Accepted Users</div>
                    {meeting.participants && meeting.participants.length > 0 ? (
                      meeting.participants.length === 1 && meeting.participants[0].id === user.id ? (
                        <span onClick={() => setClickedOnAddParticipants(true)} className="cursor-pointer">
                          None +
                        </span>
                      ) : (
                        <span
                          onClick={() => setClickedOnViewParticipants(true)}
                          className="w-fit flex-center gap-1 font-medium cursor-pointer"
                        >
                          <PictureList users={meeting.participants} size={6} gap={3} />
                        </span>
                      )
                    ) : (
                      <span onClick={() => setClickedOnAddParticipants(true)} className="cursor-pointer">
                        None +
                      </span>
                    )}
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
