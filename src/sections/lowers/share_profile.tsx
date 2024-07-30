import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { User } from '@/types';
import Image from 'next/image';
import React from 'react';
import Share from './share';

interface Props {
  user: User;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShareProfile = ({ user, setShow }: Props) => {
  return (
    <Share
      itemID={user.id}
      itemType="profile"
      setShow={setShow}
      clipboardURL={`explore/user/${user.username}?action=external`}
      item={
        <div className="w-full font-primary border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg p-4 flex flex-col items-center justify-center gap-4 max-lg:gap-4 transition-ease-300 cursor-default">
          <Image
            crossOrigin="anonymous"
            width={100}
            height={100}
            alt={'User Pic'}
            src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
            className={'rounded-full max-lg:mx-auto w-44 h-44 cursor-default'}
          />
          <div className="text-3xl max-lg:text-2xl text-center font-bold text-gradient">{user.name}</div>
          <div className="text-sm text-center">{user.tagline}</div>
          <div className="w-full flex justify-center gap-6">
            <div className="flex gap-1">
              <div className="font-bold">{user.noFollowers}</div>
              <div>Follower{user.noFollowers != 1 ? 's' : ''}</div>
            </div>
            <div className="flex gap-1">
              <div className="font-bold">{user.noFollowing}</div>
              <div>Following</div>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default ShareProfile;
