import { SERVER_ERROR } from '@/config/errors';
import { MESSAGING_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { currentChatIDSelector, setCurrentChatID } from '@/slices/messagingSlice';
import { initialChat, initialUser } from '@/types/initials';
import Toaster from '@/utils/toaster';
import { Chat, Message, TypingStatus } from '@/types';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '@/components/common/loader';
import { Dictionary, groupBy } from 'lodash';
import ChatHeader from '@/sections/messaging/chats/personal_header';
import GroupChatHeader from '@/sections/messaging/chats/group_header';
import ScrollableFeed from 'react-scrollable-feed';
import MessageGroup from '@/sections/messaging/chats/message_group';
import ChatTextarea from '@/components/messaging/chat_textarea';
import Cookies from 'js-cookie';
import socketService from '@/config/ws';
import { useWindowWidth } from '@react-hook/window-size';
import ChatInfo from '@/sections/messaging/chat_info';
import { setUnreadChats, unreadChatsSelector } from '@/slices/feedSlice';
import { getUserFromState } from '@/utils/funcs/redux';
import { getMessagingUser } from '@/utils/funcs/messaging';
import InfiniteScroll from 'react-infinite-scroll-component';
import ScrollWrapper from './scroll_wrapper';

const ChatScreen = () => {
  const [chat, setChat] = useState<Chat>(initialChat);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingStatus, setTypingStatus] = useState<TypingStatus>({ user: initialUser, chatID: '' });
  const [clickedOnInfo, setClickedOnInfo] = useState(false);

  const chatID = useSelector(currentChatIDSelector);
  const unreadChatIDs = useSelector(unreadChatsSelector) || [];
  const userID = Cookies.get('id') || '';

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const dispatch = useDispatch();

  const fetchChat = async () => {
    setLoading(true);
    const URL = `${MESSAGING_URL}/${chatID}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setChat(res.data.chat);
      await fetchMessages(res.data.chat);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  const fetchMessages = async (chat: Chat) => {
    const URL = `${MESSAGING_URL}/content/${chatID}?page=${page}&limit=10`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      const messageData: Message[] = res.data.messages || [];
      for (const message of messageData) {
        if (!message.readBy.map(r => r.userID).includes(userID))
          socketService.sendReadMessage(getUserFromState(), message.id, chat.id);
      }
      const addedMessages = [...messages, ...messageData];
      if (addedMessages.length == messages.length) setHasMore(false);
      setMessages(addedMessages);
      setPage(prev => prev + 1);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  const handleAccept = async () => {
    const URL = `${MESSAGING_URL}/accept/${chatID}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setChat({ ...chat, isAccepted: true });
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  useEffect(() => {
    if (chatID != '') {
      fetchChat();
      socketService.setupChatWindowRoutes(setMessages, typingStatus, setTypingStatus);
      socketService.setupChatReadRoutes(setMessages);
      if (unreadChatIDs.includes(chatID)) dispatch(setUnreadChats(unreadChatIDs.filter(id => id != chatID)));
    }
  }, [chatID]);

  useEffect(() => {
    return () => {
      dispatch(setCurrentChatID(''));
    };
  }, []);

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
    <div className="w-full h-full bg-gray-100 dark:bg-transparent border-2 max-lg:border-0 border-primary_btn dark:border-dark_primary_btn rounded-lg max-lg:rounded-none p-3 relative max-lg:backdrop-blur-2xl max-lg:z-50">
      {chatID == '' ? (
        <></>
      ) : loading ? (
        <Loader />
      ) : clickedOnInfo ? (
        <ChatInfo chat={chat} setShow={setClickedOnInfo} setChat={setChat} />
      ) : (
        <>
          {chat.isGroup ? (
            <GroupChatHeader chat={chat} setClickedOnInfo={setClickedOnInfo} />
          ) : (
            <ChatHeader chat={chat} setClickedOnInfo={setClickedOnInfo} />
          )}
          <ScrollWrapper
            fetchMoreMessages={() => fetchMessages(chat)}
            hasMore={hasMore}
            isFetching={loading}
            currentPage={page}
          >
            {messagesByDate &&
              Object.keys(messagesByDate)
                .reverse()
                .map(date => {
                  return <MessageGroup key={date} date={date} messages={messagesByDate[date]} chat={chat} />;
                })}
            {typingStatus.chatID == chat.id && typingStatus.user.id !== '' && typingStatus.user.id != userID && (
              <div className="w-fit dark:text-white text-sm cursor-default border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-xl px-4 py-2">
                {typingStatus.user.username} is typing...
              </div>
            )}
          </ScrollWrapper>
          <div className="flex w-[calc(100%-16px)] max-lg:w-[99%] items-end gap-2 absolute max-lg:sticky bottom-2 right-1/2 translate-x-1/2 max-lg:translate-x-0">
            {chat.isAccepted ? (
              <ChatTextarea chat={chat} />
            ) : userID != chat.userID ? (
              <div
                onClick={handleAccept}
                className="w-full h-12 rounded-md dark:text-white font-primary flex-center text-xl font-medium bg-primary_comp dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active cursor-pointer transition-ease-300"
              >
                Accept Chat
              </div>
            ) : (
              <div className="w-full h-12 rounded-md dark:text-white font-primary flex-center bg-primary_comp">
                {getMessagingUser(chat).name} has not accepted your chat yet.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatScreen;
