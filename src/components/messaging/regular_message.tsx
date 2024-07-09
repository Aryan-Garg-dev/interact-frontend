import { GroupChatMessage, Message } from '@/types';
import React from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import Cookies from 'js-cookie';
import moment from 'moment';

interface Props {
  message: Message | GroupChatMessage;
}

const RegularMessage = ({ message }: Props) => {
  const userID = Cookies.get('id');
  return (
    <div
      key={message.id}
      className={`w-full flex gap-2 font-primary ${message.userID === userID ? 'flex-row-reverse' : ''}`}
    >
      <Image
        crossOrigin="anonymous"
        width={50}
        height={50}
        alt={'User Pic'}
        src={`${USER_PROFILE_PIC_URL}/${message.user.profilePic}`}
        className={'rounded-full w-8 h-8 cursor-pointer border-[1px] border-black'}
      />
      <div className={`w-2/3 flex flex-wrap gap-2 ${message.userID === userID ? 'flex-row-reverse' : ''}`}>
        <div className="w-fit max-w-[27rem] flex flex-col text-sm cursor-default bg-primary_comp_hover dark:bg-dark_primary_comp_hover rounded-xl px-4 py-2">
          {message.content}
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

export default RegularMessage;
