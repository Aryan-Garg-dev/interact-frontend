import { COMMUNITY_COVER_PIC_URL, COMMUNITY_PROFILE_PIC_URL, COMMUNITY_URL } from '@/config/routes';
import { Community } from '@/types';
import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import CommunityJoinBtn from '../common/community_join_btn';

const CommunityCard = ({ community }: { community: Community }) => {
  return (
    <div className="w-full bg-gray-50 dark:bg-dark_primary_comp relative flex flex-col gap-2 rounded-lg border-[1px] dark:border-dark_primary_btn p-2">
      <Image
        crossOrigin="anonymous"
        width={600}
        height={100}
        alt="Community Pic"
        placeholder="blur"
        blurDataURL={community.coverPicBlurHash || 'no-hash'}
        src={`${COMMUNITY_COVER_PIC_URL}/${community.coverPic}`}
        className="w-full h-full absolute rounded-lg opacity-10 top-0 right-0"
      />
      <div className="w-full flex gap-2 items-center z-10">
        <Link href={`/community/${community.id}`} target="_blank">
          <Image
            crossOrigin="anonymous"
            width={50}
            height={50}
            alt="Community Pic"
            placeholder="blur"
            blurDataURL={community.profilePicBlurHash || 'no-hash'}
            src={`${COMMUNITY_PROFILE_PIC_URL}/${community.profilePic}`}
            className="w-10 h-10 rounded-full"
          />
        </Link>
        <Link
          href={`/community/${community.id}`}
          target="_blank"
          className="w-[calc(100%-40px-64px-16px)] h-10 flex flex-col"
        >
          <div className="w-full font-semibold line-clamp-1">{community.title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{community.noMembers} Members</div>
        </Link>
        <CommunityJoinBtn communityID={community.id} communityAccess={community.access} />
      </div>
      <Link href={`/community/${community.id}`} target="_blank" className="w-full text-xs font-medium z-10">
        {community.tagline}
      </Link>
    </div>
  );
};

export default CommunityCard;
