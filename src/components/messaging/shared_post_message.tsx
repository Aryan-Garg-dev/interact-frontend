import { GroupChatMessage, Message } from '@/types';
import React from 'react';
import Image from 'next/image';
import { POST_PIC_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import Cookies from 'js-cookie';
import moment from 'moment';
import getDisplayTime from '@/utils/funcs/get_display_time';
import Link from 'next/link';

interface Props {
  message: Message | GroupChatMessage;
}

const SharedPostMessage = ({ message }: Props) => {
  const userID = Cookies.get('id');
  return (
    <div key={message.id} className={`w-full flex gap-2 ${message.userID === userID ? 'flex-row-reverse' : ''}`}>
      <Image
        crossOrigin="anonymous"
        width={50}
        height={50}
        alt={'User Pic'}
        src={`${USER_PROFILE_PIC_URL}/${message.user.profilePic}`}
        className={'rounded-full w-8 h-8 cursor-pointer border-[1px] border-black'}
      />
      <div className={`w-1/3 flex flex-wrap gap-2 ${message.userID === userID ? 'flex-row-reverse' : ''}`}>
        <div className="w-fit max-w-[27rem] flex flex-col text-sm cursor-default rounded-xl px-4 py-2 bg-primary_comp dark:bg-dark_primary_comp_hover gap-2">
          <Link href={`/explore/post/${message.postID}`} className={`w-80 flex flex-col cursor-pointer gap-2`}>
            <div className="w-full font-primary flex gap-1 dark:text-white py-2 border-primary_btn dark:border-dark_primary_btn border-b-[1px] max-md:px-4 max-md:py-4">
              <div className="w-[15%] h-full">
                <div className="rounded-full">
                  <Image
                    crossOrigin="anonymous"
                    width={50}
                    height={50}
                    alt={'User Pic'}
                    src={`${USER_PROFILE_PIC_URL}/${message.post.user.profilePic}`}
                    className={'rounded-full w-8 h-8'}
                  />
                </div>
              </div>
              <div className="w-[85%] flex flex-col gap-3">
                <div className="w-full h-fit flex justify-between">
                  <div className="font-medium">{message.post.user.username}</div>
                  <div className="flex gap-2 font-light text-xs">{getDisplayTime(message.post.postedAt, false)}</div>
                </div>
                {message.post.images && message.post.images.length > 0 ? (
                  <Image
                    crossOrigin="anonymous"
                    width={100}
                    height={100}
                    alt={'Post Pic'}
                    src={`${POST_PIC_URL}/${message.post.images[0]}`}
                    className={`w-full rounded-lg`}
                  />
                ) : (
                  <></>
                )}
                <div className="w-full text-sm whitespace-pre-wrap overflow-clip mb-2">{message.post.content}</div>
              </div>
            </div>
          </Link>
          {message.content != '' ? (
            <div className="border-t-[1px] border-white pt-2 border-dashed overflow-clip">{message.content}</div>
          ) : (
            <></>
          )}
        </div>
        <div
          className={` flex items-center gap-1 text-xs self-end ${message.userID === userID ? 'flex-row-reverse' : ''}`}
        >
          <div>•</div>
          <div> {moment(message.createdAt).format('hh:mm A')}</div>
        </div>
      </div>
    </div>
  );
};

export default SharedPostMessage;
