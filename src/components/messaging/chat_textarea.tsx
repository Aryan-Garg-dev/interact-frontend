import React, { useState } from 'react';
// import { MeStopTyping, MeTyping, sendEvent } from '@/utils/ws';
import { Chat, GroupChat } from '@/types';
import Cookies from 'js-cookie';
import socketService from '@/config/ws';
import postHandler from '@/handlers/post_handler';
import Toaster from '@/utils/toaster';
import { SERVER_ERROR } from '@/config/errors';

interface Props {
  chat: Chat;
}

const ChatTextarea = ({ chat }: Props) => {
  const [value, setValue] = useState('');

  const userID = Cookies.get('id');

  const handleChange = (event: any) => {
    const newValue = event.target.value;

    const typingStatus = newValue === '' ? 0 : 1;
    socketService.sendTypingStatus(getSelf(chat), chat.id, typingStatus);

    setValue(newValue);
  };

  const handleKeyUp = (event: any) => {
    if (event.keyCode === 13 && event.shiftKey != true) {
      handleSubmit();
    }
  };

  const getSelf = (chat: Chat) => {
    if (userID === chat.createdByID) return chat.createdBy;
    return chat.acceptedBy;
  };

  const isBlocked = (chat: Chat) => {
    if (userID === chat.createdByID) return chat.blockedByAcceptingUser;
    return chat.blockedByCreatingUser;
  };

  const handleSubmit = async () => {
    if (value.trim() == '') return;
    socketService.sendMessage(value, chat.id, userID || '', getSelf(chat));
    socketService.sendTypingStatus(getSelf(chat), chat.id, 0);

    setValue('');

    const URL = `/messaging/content/`;
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

  return isBlocked(chat) ? (
    <div className="w-full h-[64px] backdrop-blur-md bg-primary_comp text-gray-600 dark:bg-[#c578bf10] rounded-xl p-4 dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn cursor-default">
      Chat is Blocked
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
