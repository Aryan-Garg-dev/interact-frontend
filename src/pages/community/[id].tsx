import CommunityJoinBtn from '@/components/common/community_join_btn';
import FollowBtn from '@/components/common/follow_btn';
import Sidebar from '@/components/common/sidebar';
import Tags from '@/components/common/tags';
import UserHoverCard from '@/components/common/user_hover_card';
import PostComponent from '@/components/home/post';
import RePostComponent from '@/components/home/repost';
import PostsLoader from '@/components/loaders/posts';
import { Button } from '@/components/ui/button';
import { COMMUNITY_ADMIN, COMMUNITY_MEMBER, COMMUNITY_MODERATOR } from '@/config/constants';
import { SERVER_ERROR } from '@/config/errors';
import {
  COMMUNITY_COVER_PIC_URL,
  COMMUNITY_PROFILE_PIC_URL,
  COMMUNITY_URL,
  USER_PROFILE_PIC_URL,
} from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import AddRule from '@/sections/community/add_rule';
import EditCommunity from '@/sections/community/edit_community';
import EditMemberships from '@/sections/community/edit_memberships';
import NewPost from '@/sections/home/new_post';
import { Post, User } from '@/types';
import { initialCommunity } from '@/types/initials';
import { checkCommunityAccess } from '@/utils/funcs/access';
import Toaster from '@/utils/toaster';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import PrimeWrapper from '@/wrappers/prime';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EditRule from '@/sections/community/edit_rule';

const Community = ({ id }: { id: string }) => {
  const [community, setCommunity] = useState(initialCommunity);
  const [admins, setAdmins] = useState<User[]>([]);
  const [moderators, setModerators] = useState<User[]>([]);
  const [connections, setConnections] = useState<User[]>([]);

  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [clickedOnNewPost, setClickedOnNewPost] = useState(false);

  const fetchCommunity = async () => {
    const URL = `${COMMUNITY_URL}/${id}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setCommunity(res.data.community);
      setAdmins(res.data.admins);
      setModerators(res.data.moderators);
      setConnections(res.data.connections);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  const getPosts = () => {
    const URL = `${COMMUNITY_URL}/${id}/posts?page=${page}&limit=${5}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const addedPosts = [...posts, ...res.data.posts];
          if (addedPosts.length === posts.length) setHasMore(false);
          setPosts(addedPosts);
          setPage(prev => prev + 1);
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
    fetchCommunity();
    getPosts();
  }, [id]);

  return (
    <BaseWrapper>
      <Sidebar index={5} />
      {clickedOnNewPost && (
        <NewPost setFeed={setPosts} initialCommunityID={community.id} setShow={setClickedOnNewPost} />
      )}
      <MainWrapper restrictWidth sidebarLayout>
        <div className="w-full flex flex-col gap-2">
          <div className="w-full relative">
            <Image
              crossOrigin="anonymous"
              className="w-full h-full bg-gray-200 rounded-lg"
              width={1000}
              height={1000}
              alt="cover pic"
              placeholder="blur"
              blurDataURL={community.coverPicBlurHash || 'no-hash'}
              src={`${COMMUNITY_COVER_PIC_URL}/${community.coverPic}`}
            />
            <div className="w-full flex items-end gap-2 absolute -translate-y-1/2 pl-12">
              <Image
                crossOrigin="anonymous"
                className="w-24 h-24 rounded-full border-gray-200 border-4"
                width={200}
                height={200}
                alt="profile pic"
                placeholder="blur"
                blurDataURL={community.profilePicBlurHash || 'no-hash'}
                src={`${COMMUNITY_PROFILE_PIC_URL}/${community.profilePic}`}
              />
              <div className="w-[calc(100%-96px)] flex justify-between items-center pb-1">
                <div className="text-3xl max-md:text-xl font-semibold">{community.title}</div>
                <div className="w-fit flex-center gap-2">
                  {checkCommunityAccess(COMMUNITY_MEMBER, community.id) && (
                    <Button onClick={() => setClickedOnNewPost(true)} variant="outline">
                      New Post
                    </Button>
                  )}
                  {checkCommunityAccess(COMMUNITY_MODERATOR, community.id) && (
                    <EditCommunity community={community} setCommunity={setCommunity} />
                  )}
                  {checkCommunityAccess(COMMUNITY_MODERATOR, community.id) && (
                    <EditMemberships community={community} setCommunity={setCommunity} />
                  )}
                  <CommunityJoinBtn communityID={community.id} communityAccess={community.access} smaller={false} />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex gap-4 mt-14">
            <div className="w-2/3">
              <PrimeWrapper index={0} maxIndex={0}>
                <div className="w-full">
                  {loading ? (
                    <PostsLoader />
                  ) : posts.length === 0 ? (
                    // <NoFeed />
                    <></>
                  ) : (
                    <InfiniteScroll
                      className="w-full"
                      dataLength={posts.length}
                      next={getPosts}
                      hasMore={hasMore}
                      loader={<PostsLoader />}
                    >
                      {posts.map(post => {
                        if (post.rePost) return <RePostComponent key={post.id} post={post} />;
                        else return <PostComponent key={post.id} post={post} />;
                      })}
                    </InfiniteScroll>
                  )}
                </div>
              </PrimeWrapper>
            </div>
            <div className="w-1/3 h-fit max-h-[calc(100vh-80px)] overflow-y-auto sticky top-[80px] bg-white flex flex-col gap-2 p-4 rounded-lg">
              <div className="text-gray-600">{community.description}</div>
              <Tags tags={community.tags} displayAll />
              <div className="w-full flex items-center justify-center gap-8 my-2">
                <div className="flex-center flex-col">
                  <div className="text-lg font-medium">{community.noMembers}</div>
                  <div className="text-sm text-gray-600">Members</div>
                </div>
                <div className="flex-center flex-col">
                  <div className="text-lg font-medium">2</div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
                <div className="flex-center flex-col">
                  <div className="text-lg font-medium">5</div>
                  <div className="text-sm text-gray-600">Openings</div>
                </div>
              </div>
              {connections && connections.length > 0 && (
                <span className="w-full text-center text-sm">
                  {connections
                    .filter((_, i) => i < 3)
                    .map((user, index) => (
                      <span key={user.id} className="font-semibold cursor-pointer">
                        {user.name}
                        {index < Math.min(2, connections.length - 1) ? ', ' : ' '}
                      </span>
                    ))}
                  {connections.length > 3 && <span>and {connections.length - 3} others </span>}
                  {connections.length === 1 ? 'is' : 'are'} in this community from your connections.
                </span>
              )}
              <div className="w-full h-[1px] bg-gray-300 my-2"></div>
              <div className="text-lg font-medium">Created By</div>
              <AboutUser user={community.user} />
              {admins && admins.length > 0 && (
                <>
                  <div className="w-full h-[1px] bg-gray-300 my-2"></div>
                  <div className="text-lg font-medium">Admins</div>
                  <div className="w-full flex flex-col gap-1">
                    {admins.map(user => (
                      <AboutUser key={user.id} user={user} />
                    ))}
                  </div>
                </>
              )}
              {moderators && moderators.length > 0 && (
                <>
                  <div className="w-full h-[1px] bg-gray-300 my-2"></div>
                  <div className="text-lg font-medium">Moderators</div>
                  <div className="w-full flex flex-col gap-1">
                    {moderators.map(user => (
                      <AboutUser key={user.id} user={user} />
                    ))}
                  </div>
                </>
              )}
              {((community.rules && community.rules.length > 0) ||
                checkCommunityAccess(COMMUNITY_ADMIN, community.id)) && (
                <>
                  <div className="w-full h-[1px] bg-gray-300 my-2"></div>
                  <div>
                    <div className="w-full flex items-center justify-between">
                      <div className="text-lg font-medium">Community Rules</div>
                      <AddRule communityID={community.id} setCommunity={setCommunity} />
                    </div>
                    <Accordion type="multiple">
                      <div className="w-full flex flex-col gap-1">
                        {community.rules?.map((rule, i) => (
                          <AccordionItem key={i} value={rule.id}>
                            <AccordionTrigger>{rule.title}</AccordionTrigger>
                            <AccordionContent className="flex justify-between">
                              <div>{rule.description}</div>
                              {checkCommunityAccess(COMMUNITY_ADMIN, community.id) && (
                                <EditRule rule={rule} communityID={community.id} setCommunity={setCommunity} />
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </div>
                    </Accordion>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

const AboutUser = ({ user }: { user: User }) => (
  <div className="relative">
    <div className="w-full flex gap-2 items-center justify-between">
      <div className="w-fit flex items-center gap-2 group">
        <UserHoverCard user={user} title={user.tagline} />
        <Image
          width={50}
          height={50}
          src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
          placeholder="blur"
          blurDataURL={user.profilePicBlurHash || 'no-hash'}
          alt=""
          className="w-6 h-6 rounded-full cursor-pointer"
        />
        <div className="w-fit text-lg font-medium cursor-pointer">{user.name}</div>
      </div>

      <FollowBtn toFollowID={user.id} smaller />
    </div>
  </div>
);

export default Community;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;

  return {
    props: { id },
  };
}
