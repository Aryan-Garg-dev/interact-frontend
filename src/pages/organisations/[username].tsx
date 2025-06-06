import TabMenu from '@/components/common/tab_menu';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import Sidebar from '@/components/common/sidebar';
import React, { useEffect, useState } from 'react';
import { initialOrganization, initialProfile, initialUser } from '@/types/initials';
import { EXPLORE_URL, USER_COVER_PIC_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import Posts from '@/screens/profile/posts';
import Projects from '@/screens/profile/projects';
import { GetServerSidePropsContext } from 'next/types';
import { SERVER_ERROR } from '@/config/errors';
import Loader from '@/components/common/loader';
import PostsLoader from '@/components/loaders/posts';
import About from '@/screens/profile/org_about';
import Events from '@/screens/profile/events';
import OrgSidebar from '@/components/common/org_sidebar';
import { userSelector } from '@/slices/userSlice';
import Reviews from '@/screens/profile/reviews';
import NewsFeed from '@/screens/profile/newsfeed';
import Openings from '@/screens/profile/opening';
import getDomainName from '@/utils/funcs/get_domain_name';
import Link from 'next/link';
import getIcon from '@/utils/funcs/get_icon';
import ShareProfile from '@/sections/lowers/share';
import SendMessage from '@/sections/explore/send_message';
import Report from '@/components/common/report';
import { Chat, Share, Warning } from '@phosphor-icons/react';
import { setCurrentChatID } from '@/slices/messagingSlice';
import Connections from '@/sections/explore/connections_view';
import FollowBtn from '@/components/common/follow_btn';
import { Organization } from '@/types';
import SignUp from '@/components/common/signup_box';
import ToolTip from '@/components/utils/tooltip';
import UserCard from '@/components/cards/user';
import PrimeWrapper from '@/wrappers/prime';
import TooltipIcon from '@/components/common/tooltip_icon';

interface Props {
  username: string;
}

const User = ({ username }: Props) => {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState(initialUser);
  const [profile, setProfile] = useState(initialProfile);
  const [organisation, setOrganisation] = useState(initialOrganization);
  const [loading, setLoading] = useState(true);

  const loggedInUser = useSelector(userSelector);

  const [numFollowers, setNumFollowers] = useState(user.noFollowers);
  const [clickedOnShare, setClickedOnShare] = useState(false);
  const [clickedOnChat, setClickedOnChat] = useState(false);

  const [clickedOnFollowers, setClickedOnFollowers] = useState(false);
  const [clickedOnReport, setClickedOnReport] = useState(false);

  const chatSlices = useSelector(userSelector).personalChatSlices;

  const dispatch = useDispatch();

  const handleChat = () => {
    var check = false;
    var chatID = '';
    chatSlices.forEach(chat => {
      if (chat.userID == user.id) {
        chatID = chat.chatID;
        check = true;
        return;
      }
    });
    if (check) {
      dispatch(setCurrentChatID(chatID));
      window.location.assign('/messaging');
    } else setClickedOnChat(true);
  };

  const getUser = () => {
    const URL = `${EXPLORE_URL}/orgs/${username}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setUser(res.data.user);
          setNumFollowers(res.data.user.noFollowers);
          setProfile(res.data.profile);
          const organisationData: Organization = res.data.organization;
          organisationData.user = res.data.user;
          setOrganisation(organisationData);
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
    getUser();
  }, [username]);

  return (
    <BaseWrapper title={`${user.name}`}>
      {loggedInUser.isOrganization ? <OrgSidebar index={1} /> : <Sidebar index={2} />}
      <MainWrapper restrictWidth>
        {clickedOnShare &&
          (loggedInUser.id != '' ? (
            <ShareProfile
              itemID={user.id}
              itemType="profile"
              setShow={setClickedOnShare}
              clipboardURL={`/users/${user.username}?action=external`}
              item={<UserCard user={user} />}
            />
          ) : (
            <SignUp setShow={setClickedOnShare} />
          ))}
        {clickedOnChat &&
          (loggedInUser.id != '' ? (
            <SendMessage user={user} setShow={setClickedOnChat} />
          ) : (
            <SignUp setShow={setClickedOnChat} />
          ))}
        {clickedOnReport &&
          (loggedInUser.id != '' ? (
            <Report userID={user.id} setShow={setClickedOnReport} />
          ) : (
            <SignUp setShow={setClickedOnReport} />
          ))}

        {clickedOnFollowers && <Connections type="followers" user={user} setShow={setClickedOnFollowers} />}
        <PrimeWrapper>
          <div className="w-full relative">
            <Image
              crossOrigin="anonymous"
              priority={true}
              width={10000}
              height={10000}
              alt={'User Pic'}
              src={`${USER_COVER_PIC_URL}/${user.coverPic}`}
              placeholder="blur"
              blurDataURL={user.coverPicBlurHash || 'no-hash'}
              // className="w-5/6 h-72 mx-auto object-cover rounded-b-md"
              className="w-full rounded-md"
            />
            <div className="w-full flex items-end max-md:items-center gap-4 absolute -translate-y-1/3 max-md:translate-y-0 px-36 max-md:px-4 max-md:pt-4">
              <Image
                crossOrigin="anonymous"
                className="w-40 h-40 max-md:w-24 max-md:h-24 rounded-full border-4 max-md:border-2 border-gray-200 shadow-lg"
                width={100}
                height={100}
                alt="Profile Pic"
                src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
                placeholder="blur"
                blurDataURL={user.profilePicBlurHash || 'no-hash'}
              />
              <div className="w-full flex flex-col gap-1">
                <div className="w-full flex flex-wrap justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="text-3xl max-md:text-xl font-semibold">{user.name}</div>
                    <div className="text-sm max-md:text-xs font-medium text-gray-600 dark:text-gray-300">
                      @{user.username}
                    </div>
                  </div>
                  {loggedInUser.id != '' && <FollowBtn toFollowID={user.id} setFollowerCount={setNumFollowers} />}
                </div>
                <div className="w-full flex justify-between items-center">
                  <div className="text-lg max-md:text-sm font-medium text-gray-600 dark:text-gray-300">
                    {user.tagline}
                  </div>
                  <div className="w-fit max-md:hidden flex items-center gap-1">
                    <TooltipIcon label="Message" onClick={handleChat} icon={<Chat size={18} />} />
                    <TooltipIcon label="Share" onClick={() => setClickedOnShare(true)} icon={<Share size={18} />} />
                    <TooltipIcon label="Report" onClick={() => setClickedOnReport(true)} icon={<Warning size={18} />} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => {
                      if (loggedInUser.id != '') setClickedOnFollowers(true);
                    }}
                    className={`flex items-center text-sm max-md:text-xs font-medium text-gray-700 dark:text-gray-300 ${
                      loggedInUser.id != '' ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    {numFollowers} Follower{numFollowers != 1 ? 's' : ''}
                  </div>
                  {user.links && <div className="max-md:text-xs text-gray-400">|</div>}
                  {user.links?.map(link => (
                    <Link
                      key={link}
                      href={link}
                      target="_blank"
                      className="w-fit relative group hover:scale-125 transition-ease-300"
                    >
                      <ToolTip
                        content={getDomainName(link)}
                        styles={{
                          fontSize: '10px',
                          padding: '2px 8px',
                          left: '50%',
                          translate: '-50% 80%',
                          border: 'none',
                        }}
                      />
                      {getIcon(getDomainName(link), 20, 'bold')}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-36"></div>
          <div className="w-full flex flex-col gap-6 max-lg:pt-0">
            <TabMenu
              items={['About', 'Posts', 'Projects', 'Events', 'News', 'Reviews', 'Openings']}
              active={active}
              setState={setActive}
              width={'840px'}
              sticky={true}
              smallerTextForMD={true}
            />

            <div className={`${active === 0 ? 'block' : 'hidden'}`}>
              {loading ? <Loader /> : <About profile={profile || initialProfile} organisation={organisation} />}
            </div>
            <div className={`${active === 1 ? 'block' : 'hidden'}`}>
              {loading ? (
                <div className="w-[45vw] mx-auto max-lg:w-[85%] max-md:w-screen max-lg:px-4 pb-2">
                  <PostsLoader />
                </div>
              ) : (
                <Posts userID={user.id} org={true} />
              )}
            </div>
            <div className={`${active === 2 ? 'block' : 'hidden'}`}>
              {loading ? <Loader /> : <Projects userID={user.id} org={true} />}
            </div>
            <div className={`${active === 3 ? 'block' : 'hidden'} `}>
              {loading ? <Loader /> : <Events orgID={organisation.id} />}
            </div>
            <div className={`${active === 4 ? 'block' : 'hidden'} `}>
              {loading ? <Loader /> : <NewsFeed orgID={organisation.id} />}
            </div>
            <div className={`${active === 5 ? 'block' : 'hidden'} `}>
              {loading ? <Loader /> : <Reviews orgID={organisation.id} />}
            </div>
            <div className={`${active === 6 ? 'block' : 'hidden'} `}>
              {loading ? <Loader /> : <Openings orgID={organisation.id} />}
            </div>
          </div>
        </PrimeWrapper>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default User;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { username } = context.query;

  return {
    props: { username },
  };
}
