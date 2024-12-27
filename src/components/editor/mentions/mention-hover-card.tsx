// Hovercard.tsx
import React, { useEffect, useState } from 'react';
import getHandler from '@/handlers/get_handler';
import { COMMUNITY_PROFILE_PIC_URL, EVENT_PIC_URL, EXPLORE_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import { Community, User, Event, Opening, Project, Organization  } from "@/types"
import { getProjectPicURL } from '@/utils/funcs/safe_extract';
import Image from 'next/image';

interface HovercardProps {
  id: string,
  category: string,
}

export const idType = {
  users: "uid",
  communities: "cid",
  events: "eid",
  openings: "oid",
  projects: "pid",
  orgs: "orgid"
}

interface HovercardData {
  name: string,
  profilePic: string,
  username?: string,
  tagline?: string,
  followers?: number,
  views?: number,
  members?: number,
  description?: string,
  date?: Date
}

const fetchItem = async (id: string, category: string): Promise<any> => {
  const res = await getHandler(
    `${EXPLORE_URL}/quick/item?${idType[category as keyof typeof idType]}=${id}`,
    undefined, true
  );
  return res.data;
};

const MentionHoverCard = ({ id, category }: HovercardProps) => {
  const [hoverCardData, setHoverCardData] = useState<HovercardData | null>(null);

  useEffect(() => {
    const data = fetchItem(id, category).then(data=>{
      switch(category){
        case "users": {
          const user = (data.user as User);
          setHoverCardData({
            name: user.name,
            profilePic: `${USER_PROFILE_PIC_URL}/${user.profilePic}`,
            username: user.username,
            tagline: user.tagline,
            followers: user.noFollowers,
          })
          break;
        }
        case "communities": {
          const community = (data.community as Community);
          setHoverCardData({
            name: community.title,
            profilePic: `${COMMUNITY_PROFILE_PIC_URL}/${community.profilePic}`,
            tagline: community.tagline,
            members: community.noMembers,
            views: community.noViews,
          })
          break;
        }
        case "orgs": {
          const organisation = (data.organisation as Organization);
          setHoverCardData({
            name: organisation.title,
            profilePic: `${USER_PROFILE_PIC_URL}/${organisation.user.profilePic}`,
            members: organisation.noMembers,
            followers: organisation.user.noFollowers,
          })
          break;
        }
        case "projects": {
          const project = (data.project as Project);
          setHoverCardData({
            name: project.title,
            profilePic: getProjectPicURL(data),
            members: project.noMembers,
            tagline: project.tagline,
            views: project.totalNoViews
          })
          break;
        }
        case "events": {
          const event = (data.event as Event);
          setHoverCardData({
            name: event.title,
            profilePic: `${EVENT_PIC_URL}/${event.coverPic}`,
            tagline: event.tagline,
            views: event.noViews,
            date: event.startTime
          })
          break;
        }
        case "openings": {
          const opening = (data.opening as Opening);
          setHoverCardData({
            name: opening.title,
            profilePic: getProjectPicURL(opening.project),
            description: opening.description
          })
          break;
        }
      }
    });
  }, []);

  if (!hoverCardData) return <></>;

  if (category === "events" || category === "projects"){
    return (
      <div className="flex-col gap-4 rounded-xl bg-neutral-200 dark:bg-neutral-800 shadow-md p-2">
        <div>
          <Image
            src={hoverCardData.profilePic} alt={'cover-pic'} width={100} height={100}
            className='w-full max-h-20 rounded-xl'
          />
        </div>
        <div>
          <div className='text-base font-semibold'>{hoverCardData.name}</div>
          <div className='text-sm text-neutral-800 dark:text-neutral-500'>{hoverCardData.tagline}</div>
          <div className='flex justify-between border-t mt-1 pt-1 border-neutral-700'>
            <div className='text-xs text-neutral-800 dark:text-neutral-500'>
              {
                hoverCardData.members ? `Members: ${hoverCardData.members}`
                : hoverCardData.date ? `Date: ${new Date(hoverCardData.date).toISOString()}`
                : ''
              }
            </div>
            <div className='text-xs text-neutral-800 dark:text-neutral-500'>
              Views: ${hoverCardData.views}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 rounded-xl p-2 bg-neutral-200 dark:bg-neutral-800 shadow-md">
      <div className="flex justify-center items-center min-w-fit">
        <Image
          alt={'User Pic'}
          src={hoverCardData.profilePic}
          className="w-10 h-10 rounded-full mt-1 p-1"
          width={40}
          height={40}
        />
      </div>
      <div className="flex flex-col justify-start">
        <div className="text-base font-semibold">{hoverCardData.name}</div>
        {(hoverCardData.description || hoverCardData.tagline) && (
          <div className="text-sm text-wrap text-neutral-800 dark:text-neutral-500">{hoverCardData.tagline || hoverCardData.description}</div>
        )}
        {(hoverCardData.followers || hoverCardData.members || hoverCardData.views) && <div className="flex border-t mt-1 pt-1 border-neutral-700 gap-2">
          {hoverCardData.followers != undefined && <div className="text-xs text-neutral-800 dark:text-neutral-500">Followers: {hoverCardData.followers}</div>}
          {hoverCardData.members != undefined && <div className="text-xs text-neutral-800 dark:text-neutral-500">Members: {hoverCardData.members}</div>}
          {hoverCardData.views != undefined && <div className="text-xs text-neutral-800 dark:text-neutral-500">Views: {hoverCardData.views}</div>}
        </div>}
      </div>
    </div>
  );
};

export default MentionHoverCard;
