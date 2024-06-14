import Loader from '@/components/common/loader';
import OrgSidebar from '@/components/common/org_sidebar';
import Mascot from '@/components/fillers/mascot';
import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import { currentOrgSelector } from '@/slices/orgSlice';
import { Session } from '@/types';
import { initialMeeting } from '@/types/initials';
import Toaster from '@/utils/toaster';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import Link from 'next/link';
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
    getMeeting();
    getSessions();
  }, []);

  return (
    <BaseWrapper title={`Meetings | ${currentOrg.title}`}>
      <OrgSidebar index={16} />
      <MainWrapper>
        <div className="w-full flex justify-between items-center p-base_padding">
          {loading ? (
            <Loader />
          ) : (
            <div className="w-full flex flex-col gap-2">
              <div>
                <div className="text-xl font-medium"> {meeting.title}</div>
                <div className="line-clamp-1">{meeting.description}</div>
                <div onClick={handleJoinMeeting} className="cursor-pointer">
                  Join Meet
                </div>
              </div>
              <div className="w-full flex flex-col gap-1">
                <div>Sessions</div>
                {sessions && sessions.length > 0 ? (
                  sessions.map(session => <div key={session.id}>{session.id}</div>)
                ) : (
                  <Mascot message="No Sessions yet." />
                )}
              </div>
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
