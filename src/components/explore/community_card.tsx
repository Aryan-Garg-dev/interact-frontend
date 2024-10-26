import { COMMUNITY_PROFILE_PIC_URL, COMMUNITY_URL } from '@/config/routes';
import { Community } from '@/types';
import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import CommunityJoinBtn from '../common/community_join_btn';

const CommunityCard = ({ community }: { community: Community }) => {
  return (
    <div className="w-full bg-gray-50 flex flex-col gap-2 rounded-lg border-[1px] p-2">
      <div className="w-full flex gap-2 items-center">
        <Link href={`/community/${community.id}`}>
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
        <Link href={`/community/${community.id}`} className="w-[calc(100%-40px-64px-16px)] h-10 flex flex-col">
          <div className="w-full font-semibold line-clamp-1">{community.title}</div>
          <div className="text-xs text-gray-500">{community.noMembers} Members</div>
        </Link>
        <CommunityJoinBtn communityID={community.id} communityAccess={community.access} />
      </div>
      <Link href={`/community/${community.id}`} className="w-full text-xs font-medium">
        {community.tagline}
      </Link>
    </div>
  );
};

export default CommunityCard;
