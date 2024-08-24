import { Chat } from '@/types';
import React from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import getDisplayTime from '@/utils/funcs/get_display_time';
import { getMessagingUser, isChatUnread } from '@/utils/funcs/messaging';
import { useDispatch, useSelector } from 'react-redux';
import { currentChatIDSelector, setCurrentChatID } from '@/slices/messagingSlice';
import { userIDSelector } from '@/slices/userSlice';
import { Circle } from '@phosphor-icons/react';

interface Props {
  chat: Chat;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  setUnreadChatCounts: React.Dispatch<React.SetStateAction<number[]>>;
}

const PersonalChatCard = ({ chat, setChats, setUnreadChatCounts }: Props) => {
  const userID = useSelector(userIDSelector);
  const dispatch = useDispatch();

  const currentChatID = useSelector(currentChatIDSelector);

  const handleClick = () => {
    dispatch(setCurrentChatID(chat.id));
    if (isChatUnread(chat) && chat.isAccepted)
      setUnreadChatCounts(([personalCount, groupCount, projectCount, requestCount]) => [
        personalCount - 1,
        groupCount,
        projectCount,
        requestCount,
      ]);
    setChats(prev =>
      prev.map(c => {
        if (c.id == chat.id && c.latestMessageID && isChatUnread(c)) {
          const readBy = c.latestMessage?.readBy || [];
          readBy.push({ messageID: c.latestMessageID, userID, readAt: new Date(), user: null });
          c.latestMessage.readBy = readBy;
        }
        return c;
      })
    );
  };

  const getLatestMessageContent = () => {
    if (chat.latestMessage.content != '') return chat.latestMessage.content;
    if (chat.latestMessage.postID) return 'shared a post.';
    if (chat.latestMessage.projectID) return 'shared a project.';
    if (chat.latestMessage.openingID) return 'shared an opening.';
    if (chat.latestMessage.profileID) return 'shared a profile.';
    if (chat.latestMessage.announcementID) return 'shared an announcement.';
    if (chat.latestMessage.eventID) return 'shared an event.';
    return '';
  };
  return (
    <div
      onClick={handleClick}
      className={`w-full relative font-primary dark:text-white ${
        chat.id == currentChatID
          ? 'bg-primary_comp_hover dark:bg-dark_primary_comp_active'
          : 'hover:bg-primary_comp dark:hover:bg-dark_primary_comp_hover'
      } border-[1px] border-primary_btn dark:border-dark_primary_btn rounded-lg flex gap-4 p-3 cursor-pointer transition-ease-300`}
    >
      <Image
        crossOrigin="anonymous"
        width={100}
        height={100}
        alt={'User Pic'}
        src={`${USER_PROFILE_PIC_URL}/${getMessagingUser(chat).profilePic}`}
        className={'rounded-full w-14 h-14 cursor-pointer border-[1px] border-black'}
      />
      <div className="w-[calc(100%-56px)] flex items-center justify-between">
        <div className="grow flex flex-col gap-1">
          <div className="text-xl font-semibold">{getMessagingUser(chat).name}</div>

          {chat.latestMessage && (
            <div className="w-full line-clamp-2 font-light">
              <span className="mr-2 font-medium">
                • {chat.latestMessage.userID == userID ? 'You' : `${getMessagingUser(chat).username}`}
              </span>
              {getLatestMessageContent()}
            </div>
          )}
        </div>
        <div className="flex-center flex-col font text-xs">
          {chat.latestMessage && getDisplayTime(chat.latestMessage.createdAt, false)}
          {chat.latestMessageID && isChatUnread(chat) && (
            <>
              <div className="text-xxs text-primary_text font-medium">Unread</div>
              <Circle
                className="text-primary_text absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
                size={16}
                weight="fill"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalChatCard;
