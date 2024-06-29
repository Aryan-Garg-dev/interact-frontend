import { SERVER_ERROR } from '@/config/errors';
import { MESSAGING_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { currentGroupChatIDSelector } from '@/slices/messagingSlice';
import { initialGroupChat, initialGroupChatMembership, initialUser } from '@/types/initials';
import Toaster from '@/utils/toaster';
import { GroupChat, GroupChatMessage, TypingStatus } from '@/types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '@/components/common/loader';
import { groupBy } from 'lodash';
import ChatHeader from '@/sections/messaging/chats/group_header';
import ScrollableFeed from 'react-scrollable-feed';
import MessageGroup from '@/sections/messaging/chats/message_group';
import ChatTextarea from '@/components/messaging/group_chat_textarea';
import Cookies from 'js-cookie';
import socketService from '@/config/ws';
import GroupInfo from '@/sections/messaging/group_info';
import { useWindowWidth } from '@react-hook/window-size';

const GroupChat = () => {
  const [chat, setChat] = useState<GroupChat>(initialGroupChat);
  const [messages, setMessages] = useState<GroupChatMessage[]>([]);
  const [membership, setMembership] = useState(initialGroupChatMembership);
  const [loading, setLoading] = useState(true);
  const [typingStatus, setTypingStatus] = useState<TypingStatus>({ user: initialUser, chatID: '' });
  const [clickedOnInfo, setClickedOnInfo] = useState(false);

  const chatID = useSelector(currentGroupChatIDSelector);
  const userID = Cookies.get('id');

  const fetchChat = async () => {
    setLoading(true);
    const URL = `${MESSAGING_URL}/group/${chatID}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      const chatData: GroupChat = res.data.chat;
      chatData.invitations = chatData.invitations.filter(invitation => invitation.status == 0);
      setChat(chatData);
      setMembership(res.data.membership);
      await fetchMessages();
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  const fetchMessages = async () => {
    const URL = `${MESSAGING_URL}/content/group/${chatID}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setMessages(res.data.messages || []);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  useEffect(() => {
    if (chatID != '') {
      fetchChat();
      socketService.setupGroupChatWindowRoutes(setMessages, typingStatus, setTypingStatus);
    }
  }, [chatID]);

  const windowWidth = useWindowWidth();

  useEffect(() => {
    if (windowWidth < 640) {
      document.documentElement.style.overflowY = 'hidden';
      document.documentElement.style.height = '100vh';

      return () => {
        document.documentElement.style.overflowY = 'auto';
        document.documentElement.style.height = 'auto';
      };
    }
  }, []);

  const messagesByDate = groupBy(messages, message => new Date(message.createdAt).toLocaleDateString());

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-transparent dark:text-white font-primary border-2 max-lg:border-0 border-primary_btn dark:border-dark_primary_btn rounded-lg max-lg:rounded-none p-3 relative max-lg:backdrop-blur-2xl max-lg:z-50">
      {chatID == '' ? (
        <></>
      ) : (
        <>
          {loading ? (
            <Loader />
          ) : clickedOnInfo ? (
            <GroupInfo chat={chat} membership={membership} setShow={setClickedOnInfo} setChat={setChat} />
          ) : (
            <>
              <ChatHeader chat={chat} setClickedOnInfo={setClickedOnInfo} />
              <div className="w-full h-[calc(100%-72px)] max-h-full flex flex-col gap-6 overflow-hidden">
                <ScrollableFeed>
                  {Object.keys(messagesByDate)
                    .reverse()
                    .map(date => {
                      return <MessageGroup key={date} date={date} messages={messagesByDate[date]} />;
                    })}
                  {typingStatus.chatID == chat.id && typingStatus.user.id !== '' && typingStatus.user.id != userID ? (
                    <div className="w-fit dark:text-white text-sm cursor-default border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-xl px-4 py-2">
                      {typingStatus.user.username} is typing...
                    </div>
                  ) : (
                    <></>
                  )}
                </ScrollableFeed>
              </div>
              <div className="flex w-[calc(100%-16px)] max-lg:w-[99%] items-end gap-2 absolute max-lg:sticky bottom-2 right-1/2 translate-x-1/2 max-lg:translate-x-0">
                <ChatTextarea chat={chat} membership={membership} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default GroupChat;
