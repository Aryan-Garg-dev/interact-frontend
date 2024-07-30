import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { Announcement } from '@/types';
import getDisplayTime from '@/utils/funcs/get_display_time';
import Image from 'next/image';
import React from 'react';
import Share from './share';
import renderContentWithLinks from '@/utils/funcs/render_content_with_links';

interface Props {
  announcement: Announcement;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShareAnnouncement = ({ announcement, setShow }: Props) => {
  return (
    <Share
      itemID={announcement.id}
      itemType="announcement"
      setShow={setShow}
      clipboardURL={`explore/announcement/${announcement.id}`}
      item={
        <div className="w-full font-primary flex gap-1 dark:text-white border-[#535353] border-[1px] p-2 rounded-lg">
          <div className="rounded-full">
            <Image
              crossOrigin="anonymous"
              width={100}
              height={100}
              alt={'User Pic'}
              src={`${USER_PROFILE_PIC_URL}/${announcement.organization?.user.profilePic}`}
              className="rounded-full w-8 h-8"
            />
          </div>
          <div className="w-[calc(100%-32px)] flex flex-col gap-1">
            <div className="w-full h-fit flex justify-between">
              <div className="font-medium">{announcement.organization?.user.name}</div>
              <div className="text-xs">{getDisplayTime(announcement.createdAt, false)}</div>
            </div>
            <div className="w-full font-medium">{announcement.title}</div>
            <div className="w-full text-sm whitespace-pre-wrap mb-1 line-clamp-4">
              {renderContentWithLinks(announcement.content, announcement.taggedUsers)}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default ShareAnnouncement;
