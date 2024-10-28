import { EXPLORE_URL, USER_URL } from '@/config/routes';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import { ChartLineUp, Lock } from '@phosphor-icons/react';
import { SERVER_ERROR } from '@/config/errors';
import { Meeting, Task, User } from '@/types';
import { userSelector } from '@/slices/userSlice';
import UserCard from '@/components/explore/user_card';
import { getNextSessionTime } from '@/utils/funcs/session_details';
import moment from 'moment';
import { SidePrimeWrapper } from '@/wrappers/side';

const FeedSide = () => {
  const [searches, setSearches] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector(userSelector);

  const fetchSearches = () => {
    const URL = `${EXPLORE_URL}/trending_searches`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const searchData: string[] = res.data.searches || [];
          setSearches(searchData.splice(0, 10));
          setLoading(false);
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

  const fetchProfiles = () => {
    const URL = `${EXPLORE_URL}/users?order=trending&limit=5`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const profileData: User[] = res.data.users || [];
          setUsers(profileData.filter(u => u.id != user.id));
          setLoading(false);
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

  const fetchTasks = () => {
    const URL = `${USER_URL}/me/tasks?limit=5`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setTasks(res.data.tasks || []);
          setLoading(false);
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

  const fetchMeetings = () => {
    const URL = `${USER_URL}/me/meetings?limit=5`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setMeetings(res.data.meetings || []);
          setLoading(false);
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
    fetchProfiles();
    fetchSearches();

    if (user.id) {
      fetchTasks();
      fetchMeetings();
    }
  }, []);

  return loading ? (
    <></>
  ) : (
    <>
      {meetings && meetings.length > 0 && (
        <SidePrimeWrapper title="Upcoming Meetings">
          <div className="w-full flex flex-col gap-1">
            {meetings.map(meeting => (
              <Link
                href={`/organisations?oid=${meeting.organizationID}&redirect_url=/meetings/${meeting.id}`}
                key={meeting.id}
                className="w-full flex justify-between items-center flex-wrap hover:scale-105 hover:bg-primary_comp dark:hover:bg-dark_primary_comp_hover rounded-lg px-2 py-1 transition-ease-300"
              >
                <div className="w-[calc(100%-112px)]">
                  <div className="font-medium line-clamp-1">{meeting.title}</div>
                  <div className="text-xs line-clamp-1">@{meeting.organization.title}</div>
                </div>
                <div className="w-28 text-xs text-end">{getNextSessionTime(meeting, false, 'hh:mm A DD MMM')}</div>
              </Link>
            ))}
          </div>
        </SidePrimeWrapper>
      )}
      {tasks && tasks.length > 0 && (
        <SidePrimeWrapper title="Pending Tasks">
          <div className="w-full flex flex-col gap-1">
            {tasks.map(task => (
              <Link
                href={
                  task.project?.title
                    ? `/workspace/tasks/${task.project?.slug}?tid=${task.id}`
                    : `/organisations?oid=${task.organizationID}&redirect_url=/tasks?tid=${task.id}`
                }
                key={task.id}
                className="w-full flex justify-between items-center flex-wrap hover:scale-105 hover:bg-primary_comp dark:hover:bg-dark_primary_comp_hover rounded-lg px-2 py-1 transition-ease-300"
              >
                <div className="w-[calc(100%-112px)]">
                  <div className="font-medium line-clamp-1">{task.title}</div>
                  <div className="text-xs line-clamp-1">
                    @{task.project?.title ? task.project.title : task.organization?.title}
                  </div>
                </div>
                <div
                  className={`w-28 text-xs text-end ${
                    moment(task.deadline).isBefore(moment()) ? 'text-primary_danger' : 'text-green-400'
                  }`}
                >
                  {moment(task.deadline).format('hh:mm A DD MMM')}
                </div>
              </Link>
            ))}
          </div>
        </SidePrimeWrapper>
      )}
      {searches && searches.length > 0 && (
        <SidePrimeWrapper title="Trending Now">
          <div className="w-full gap-2 mt-2 flex flex-wrap">
            {searches.map((str, i) => {
              return (
                <Link
                  href={`/explore?search=${str}`}
                  key={i}
                  className="w-fit flex items-center gap-2 bg-slate-100 dark:bg-dark_primary_comp_hover rounded-lg px-4 py-1 hover:scale-105 transition-ease-300"
                >
                  <div>{str}</div>
                  {i < 3 && <ChartLineUp />}
                </Link>
              );
            })}
          </div>
        </SidePrimeWrapper>
      )}
      {users && users.length > 0 && (
        <SidePrimeWrapper title="Profiles to Follow" style={{ position: 'sticky', top: '84px' }}>
          {user.id == '' && (
            <div className="w-full h-[calc(100%-48px)] flex-center flex-col gap-1 absolute top-12 right-0 backdrop-blur-sm rounded-lg z-10">
              <div className="bg-white flex-center gap-1 border-primary_black border-[1px] rounded-lg px-2 py-1">
                <Lock /> Locked
              </div>
              <Link href={'/login'} className="font-medium hover-underline-animation after:bg-black">
                Sign up to see who&apos;s here
              </Link>
            </div>
          )}

          <div className="w-full flex flex-col gap-2">
            {users.map(user => (
              <UserCard key={user.id} user={user} forTrending={true} />
            ))}
          </div>
        </SidePrimeWrapper>
      )}
    </>
  );
};

export default FeedSide;
