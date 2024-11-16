import React, { useState } from 'react';
import Image from 'next/image';
import { USER_COVER_PIC_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import { User } from '@/types';
import Link from 'next/link';
import FollowBtn from '../common/follow_btn';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';
import { Buildings, Eye, MapPin, Users } from '@phosphor-icons/react';
import Tags from '../common/tags';

interface Props {
  user: User;
}

const UserCard = ({ user }: Props) => {
  const [noFollowers, setNoFollowers] = useState(user.noFollowers);
  const loggedInUser = useSelector(userSelector);
  return (
    <Link
      href={`/${user.isOrganization ? 'organisations' : 'users'}/${user.username}`}
      target="_blank"
      className="w-90 max-md:w-full flex flex-col gap-2 rounded-xl bg-white dark:bg-dark_primary_comp_hover font-primary hover:shadow-xl transition-ease-300 animate-fade_third"
    >
      <div className="w-full relative">
        <Image
          crossOrigin="anonymous"
          width={200}
          height={200}
          alt={'User Pic'}
          src={`${USER_COVER_PIC_URL}/${user.coverPic}`}
          placeholder="blur"
          blurDataURL={user.coverPicBlurHash || 'no-hash'}
          className="w-full h-40 rounded-t-xl fade-img2 absolute top-0"
        />
        <div className="w-full flex gap-4 p-4">
          <Image
            crossOrigin="anonymous"
            width={100}
            height={100}
            alt={'User Pic'}
            src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
            placeholder="blur"
            blurDataURL={user.profilePicBlurHash || 'no-hash'}
            className="w-24 h-24 rounded-full z-[1]"
          />
          <div className="w-full flex flex-col justify-center">
            <div className="w-full text-2xl font-semibold line-clamp-1">{user.name}</div>
            <div className="w-full text-sm text-gray-600 dark:text-gray-100 font-medium">@{user.username}</div>
          </div>
        </div>
      </div>
      <div className="w-full h-full flex flex-col justify-between p-4 pt-0 gap-4">
        <div>{user.tags && <Tags tags={user.tags} limit={25} />}</div>
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2 px-2 font-medium text-xs text-gray-700 dark:text-gray-200">
              <div className="w-full flex justify-between flex-wrap gap-2 font-medium text-xs text-gray-700 dark:text-gray-200">
                <div className="flex gap-1 items-center">
                  <Users />{' '}
                  <div>
                    {noFollowers} Follower{noFollowers != 1 ? 's' : ''}
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <div>{user.noImpressions}</div> <Eye />
                </div>
              </div>

              <div className="w-full flex justify-between flex-wrap gap-2 font-medium text-xs text-gray-700 dark:text-gray-200">
                {user.profile?.school && (
                  <div className="flex gap-1 items-center">
                    <Buildings /> <div className="text-xs">{user.profile.school}</div>
                  </div>
                )}

                {user.profile?.location && (
                  <div
                    className={`flex gap-1 items-center ${
                      !user.profile || user.profile.school == '' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className="text-xs">{user.profile.location}</div>
                    <MapPin />
                  </div>
                )}
              </div>
            </div>

            <div className="border-t-[1px] border-gray-500 border-dashed"></div>
            {user.tagline != '' && (
              <div className="text-sm text-gray-600 dark:text-gray-100 text-center line-clamp-1">{user.tagline}</div>
            )}
          </div>
          {loggedInUser.id != '' && (
            <div
              onClick={el => {
                el.preventDefault();
              }}
              className="w-full flex-center"
            >
              <FollowBtn toFollowID={user.id} setFollowerCount={setNoFollowers} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default UserCard;
