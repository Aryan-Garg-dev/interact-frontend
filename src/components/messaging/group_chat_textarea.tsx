import React, { useState } from 'react';
// import { MeStopTyping, MeTyping, sendEvent } from '@/utils/ws';
import { Chat, GroupChat, GroupChatMembership, User } from '@/types';
import Cookies from 'js-cookie';
import socketService from '@/config/ws';
import postHandler from '@/handlers/post_handler';
import Toaster from '@/utils/toaster';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';
import { initialUser } from '@/types/initials';
import { SERVER_ERROR } from '@/config/errors';
import { GROUP_MEMBER } from '@/config/constants';

interface Props {
  chat: GroupChat;
  membership: GroupChatMembership;
}

const ChatTextarea = ({ chat, membership }: Props) => {
  const [height, setHeight] = useState('auto');
  const [value, setValue] = useState('');

  const MAX_HEIGHT = 128;
  const INITIAL_HEIGHT = 48;

  const userID = Cookies.get('id');

  const user = useSelector(userSelector);

  const handleChange = (event: any) => {
    const newValue = event.target.value;

    if (value === '' && newValue.length === 1) socketService.sendTypingStatus(getSelf(), chat.id, 1);
    else if (newValue === '') socketService.sendTypingStatus(getSelf(), chat.id, 0);

    setValue(newValue);
    setHeight('auto');
    if (event.target.scrollHeight <= MAX_HEIGHT) {
      setHeight(`${event.target.scrollHeight}px`);
    } else {
      setHeight(`${MAX_HEIGHT}px`);
    }
  };

  const handleKeyUp = (event: any) => {
    if (event.keyCode === 13) {
      if (event.shiftKey === true) {
        if (event.target.scrollHeight <= MAX_HEIGHT) {
          setHeight(`${event.target.scrollHeight}px`);
        }
      } else {
        handleSubmit();
        setHeight(`${INITIAL_HEIGHT}px`);
      }
    }
  };

  const getSelf = (): User => {
    return { ...initialUser, id: user.id, username: user.name, name: user.name, profilePic: user.profilePic };
  };

  const handleSubmit = async () => {
    if (value.trim() == '') return;
    socketService.sendMessage(value, chat.id, userID || '', getSelf());
    socketService.sendTypingStatus(getSelf(), chat.id, 0);

    setValue('');

    const URL = `/messaging/content/group/`;
    const formData = {
      content: value,
      chatID: chat.id,
    };

    const res = await postHandler(URL, formData);

    if (res.statusCode === 201) {
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      }
    }
  };

  return chat.adminOnly && membership.role == GROUP_MEMBER ? (
    <div className="w-full h-[64px] backdrop-blur-md bg-primary_comp text-gray-600 dark:bg-[#c578bf10] rounded-xl p-4 dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn cursor-default">
      Only Admins can send messages
    </div>
  ) : (
    <textarea
      value={value}
      onChange={handleChange}
      onKeyUp={handleKeyUp}
      // style={{ height: height, resize: 'none' }}
      placeholder="Message..."
      className="w-full h-[64px] min-h-[64px] max-h-[132px] backdrop-blur-md bg-primary_comp dark:bg-[#c578bf10] rounded-xl p-4 dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn overflow-auto focus:outline-none"
    />
  );
};

export default ChatTextarea;
