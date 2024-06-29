import { Chat } from '@/types';
import Cookies from 'js-cookie';
import React from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import getDisplayTime from '@/utils/funcs/get_display_time';
import getMessagingUser from '@/utils/funcs/get_messaging_user';
import { useDispatch, useSelector } from 'react-redux';
import { currentChatIDSelector, setCurrentChatID, setCurrentGroupChatID } from '@/slices/messagingSlice';
import { useRouter } from 'next/router';

interface Props {
  chat: Chat;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

const PersonalChatCard = ({ chat, setChats }: Props) => {
  const userID = Cookies.get('id');
  const dispatch = useDispatch();
  const router = useRouter();

  const currentChatID = useSelector(currentChatIDSelector);

  const handleClick = () => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, chat: 'personal' },
    });
    dispatch(setCurrentGroupChatID(''));
    dispatch(setCurrentChatID(chat.id));
    // setChats(prev =>
    //   prev.map(c => {
    //     if (c.id == chat.id && c.latestMessage.userID != userID && getLastReadMessageID() != c.latestMessage.id) {
    //       //! latestMessageId is not there in messages from socket
    //       if (c.createdByID == userID) c.lastReadMessageByCreatingUserID = c.latestMessageID;
    //       else c.lastReadMessageByAcceptingUserID = c.latestMessageID;
    //     }
    //     return c;
    //   })
    // );
  };

  const getLastReadMessageID = () => {
    if (chat.createdByID == userID) return chat.lastReadMessageByCreatingUserID;
    return chat.lastReadMessageByAcceptingUserID;
  };
  return (
    <div
      onClick={handleClick}
      className={`w-full font-primary dark:text-white ${
        chat.id == currentChatID
          ? 'bg-primary_comp_hover dark:bg-dark_primary_comp_active'
          : 'hover:bg-primary_comp dark:hover:bg-dark_primary_comp_hover'
      } border-[1px] border-primary_btn dark:border-dark_primary_btn rounded-lg flex gap-4 px-5 py-4 cursor-pointer transition-ease-300`}
    >
      <Image
        crossOrigin="anonymous"
        width={100}
        height={100}
        alt={'User Pic'}
        src={`${USER_PROFILE_PIC_URL}/${getMessagingUser(chat).profilePic}`}
        className={'rounded-full w-14 h-14 cursor-pointer border-[1px] border-black'}
      />
      <div className="w-full flex flex-col gap-1">
        <div className="w-full flex items-center justify-between">
          <div className="text-xl font-semibold">{getMessagingUser(chat).name}</div>
          <div className="flex flex-col font text-xs">
            {chat.latestMessage ? getDisplayTime(chat.latestMessage.createdAt, false) : ''}
            {/* {chat.latestMessage.userID != userID && getLastReadMessageID() != chat.latestMessage.id ? (
              <>Unread</>
            ) : (
              <></>
            )} */}
          </div>
        </div>
        {chat.latestMessage ? (
          <div className="w-full line-clamp-2 font-light">
            <span className="mr-2 font-medium">
              • {chat.latestMessage.userID == userID ? 'You' : `${getMessagingUser(chat).username}`}
            </span>
            {chat.latestMessage.content}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default PersonalChatCard;
