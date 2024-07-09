import React, { useState } from 'react';
import { CaretRight, Pen, Plus, X } from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';
import { Chat } from '@/types';
import { SERVER_ERROR } from '@/config/errors';
import Toaster from '@/utils/toaster';
import ConfirmDelete from '@/components/common/confirm_delete';
import { MESSAGING_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import getMessagingUser from '@/utils/funcs/get_messaging_user';
import Cookies from 'js-cookie';
import postHandler from '@/handlers/post_handler';
import { useDispatch } from 'react-redux';
import { setCurrentChatID } from '@/slices/messagingSlice';

interface Props {
  chat: Chat;
  setChat: React.Dispatch<React.SetStateAction<Chat>>;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setChats?: React.Dispatch<React.SetStateAction<Chat[]>>;
}

const ChatInfo = ({ chat, setChat, setShow, setChats }: Props) => {
  const [clickedOnBlock, setClickedOnBlock] = useState(false);
  const [clickedOnDelete, setClickedOnDelete] = useState(false);

  const userID = Cookies.get('id');

  const dispatch = useDispatch();

  const isBlockedByUser = (chat: Chat) => {
    if (userID === chat.createdByID) return chat.blockedByCreatingUser;
    return chat.blockedByAcceptingUser;
  };

  const handleBlock = async () => {
    const toaster = Toaster.startLoad('Blocking Chat');

    const URL = `${MESSAGING_URL}/chat/${isBlockedByUser(chat) ? 'unblock' : 'block'}`;

    const res = await postHandler(URL, { chatID: chat.id });
    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, `Chat ${isBlockedByUser(chat) ? 'Unblocked' : 'blocked'}`, 1);

      setChat(prev => {
        if (prev.acceptedByID == userID) return { ...prev, blockedByAcceptingUser: !prev.blockedByAcceptingUser };
        else return { ...prev, blockedByCreatingUser: !prev.blockedByCreatingUser };
      });
      setClickedOnBlock(false);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
  };

  const handleDelete = async () => {
    const toaster = Toaster.startLoad('Deleting Chat');

    const URL = `${MESSAGING_URL}/chat/reset`;

    const res = await postHandler(URL, { chatID: chat.id });
    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'Chat Deleted', 1);

      dispatch(setCurrentChatID(''));
      if (setChats) setChats(prev => prev.filter(c => c.id != chat.id));
      setClickedOnDelete(false);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
  };
  return (
    <>
      {clickedOnBlock ? (
        <ConfirmDelete
          setShow={setClickedOnBlock}
          handleDelete={handleBlock}
          title={`Confirm ${isBlockedByUser(chat) ? 'Unblock' : 'Block'}?`}
        />
      ) : (
        <></>
      )}
      {clickedOnDelete ? (
        <ConfirmDelete setShow={setClickedOnDelete} handleDelete={handleDelete} title="Confirm Delete?" />
      ) : (
        <></>
      )}
      <div className="w-full h-full overflow-y-auto flex flex-col gap-4">
        <div className="w-full flex items-center justify-between p-2">
          <div className="text-3xl font-semibold">Chat Info</div>
          <X onClick={() => setShow(false)} className="cursor-pointer" size={32} />
        </div>

        <div className="flex gap-2 items-center px-2">
          <Image
            crossOrigin="anonymous"
            width={50}
            height={50}
            alt={'User Pic'}
            src={`${USER_PROFILE_PIC_URL}/${getMessagingUser(chat).profilePic}`}
            className={'rounded-full w-16 h-16'}
          />
          <div className="flex flex-col">
            <div className="text-2xl font-medium">{getMessagingUser(chat).name}</div>
            <div className="text-sm">@{getMessagingUser(chat).username}</div>
          </div>
        </div>

        <div className="text-center opacity-75 text-sm mt-4">
          Initiated By{' '}
          {chat.createdBy.id == userID ? (
            <span className="font-semibold underline underline-offset-2">You</span>
          ) : (
            <Link
              href={`/explore/user/${chat.createdBy.username}`}
              target="_blank"
              className="font-semibold underline underline-offset-2"
            >
              {chat.createdBy.name}
            </Link>
          )}{' '}
          on {moment(chat.createdAt).format('DD MMM YYYY')}
        </div>

        <div className="w-full  rounded-md flex flex-col gap-1 p-4">
          <div
            onClick={() => setClickedOnBlock(true)}
            className="w-full py-4 text-center dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active text-primary_danger rounded-lg cursor-pointer transition-ease-300"
          >
            {isBlockedByUser(chat) ? 'Unblock Chat' : 'Block Chat'}
          </div>
          <div
            onClick={() => setClickedOnDelete(true)}
            className="w-full py-4 text-center dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active text-primary_danger rounded-lg cursor-pointer transition-ease-300"
          >
            Delete Chat
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInfo;
