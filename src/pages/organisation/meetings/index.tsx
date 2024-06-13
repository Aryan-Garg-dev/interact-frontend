import BaseWrapper from '@/wrappers/base';
import OrgSidebar from '@/components/common/org_sidebar';
import MainWrapper from '@/wrappers/main';
import getHandler from '@/handlers/get_handler';
import { useSelector } from 'react-redux';
import { currentOrgSelector } from '@/slices/orgSlice';
import { useState, useEffect } from 'react';
import NewMeeting from '@/sections/organization/meetings/new_meeting';
import checkOrgAccess from '@/utils/funcs/check_org_access';
import { Info, Plus } from '@phosphor-icons/react';
import { ORG_SENIOR } from '@/config/constants';
// import NoMeetings from '@/components/fillers/meetings';
import MeetingCard from '@/components/organization/meeting_card';
import { Meeting } from '@/types';
import Toaster from '@/utils/toaster';
import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import InfiniteScroll from 'react-infinite-scroll-component';
import AccessTree from '@/components/organization/access_tree';
import OrgMembersOnlyAndProtect from '@/utils/wrappers/org_members_only';
import WidthCheck from '@/utils/wrappers/widthCheck';

const Meetings = () => {
  const [loading, setLoading] = useState(true);
  const [clickedOnNewMeeting, setClickedOnNewMeeting] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const [clickedOnInfo, setClickedOnInfo] = useState(false);

  const currentOrg = useSelector(currentOrgSelector);

  const getMeetings = async () => {
    const URL = `/org/${currentOrg.id}/meetings?page=${page}&limit=${10}`;
    const res = await getHandler(URL);
    if (res.statusCode === 200) {
      const addedMeetings = [...meetings, ...(res.data.meetings || [])];
      if (addedMeetings.length === meetings.length) setHasMore(false);
      setMeetings(addedMeetings);
      setPage(prev => prev + 1);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    getMeetings();
  }, []);

  return (
    <BaseWrapper title={`Meetings | ${currentOrg.title}`}>
      <OrgSidebar index={16} />
      <MainWrapper>
        {clickedOnNewMeeting && <NewMeeting setShow={setClickedOnNewMeeting} setMeetings={setMeetings} />}
        {/* {clickedOnInfo && <AccessTree type="meeting" setShow={setClickedOnInfo} />} */}
        <div className="w-full flex justify-between items-center p-base_padding">
          <div className="w-fit text-6xl font-semibold dark:text-white font-primary ">Meetings</div>
          <div className="flex items-center gap-2">
            {checkOrgAccess(ORG_SENIOR) && (
              <Plus
                onClick={() => setClickedOnNewMeeting(prev => !prev)}
                size={42}
                className="flex-center rounded-full hover:bg-white p-2 transition-ease-300 cursor-pointer"
                weight="regular"
              />
            )}
            <Info
              onClick={() => setClickedOnInfo(true)}
              size={42}
              className="flex-center rounded-full hover:bg-white p-2 transition-ease-300 cursor-pointer"
              weight="regular"
            />
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : meetings.length > 0 ? (
          <InfiniteScroll
            dataLength={meetings.length}
            next={getMeetings}
            hasMore={hasMore}
            loader={<Loader />}
            className="w-full flex flex-wrap gap-4 justify-between px-base_padding"
          >
            {meetings.map(meeting => {
              return <MeetingCard key={meeting.id} meeting={meeting} setMeetings={setMeetings} />;
            })}
          </InfiniteScroll>
        ) : (
          <></>
          //   <NoMeetings width="2/3" />
        )}
      </MainWrapper>
    </BaseWrapper>
  );
};

export default WidthCheck(OrgMembersOnlyAndProtect(Meetings));
