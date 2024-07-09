import { GroupChat, Project } from '@/types';
import { Plus } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import NewChat from '@/sections/workspace/manage_project/new_chat';
import ChatCard from '@/components/workspace/manage_project/chat_card';
import { PROJECT_URL } from '@/config/routes';
import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import Loader from '@/components/common/loader';
import { initialGroupChat } from '@/types/initials';
import EditChat from '@/sections/workspace/manage_project/edit_chat';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';
import NoChats from '@/components/fillers/project_chats';

interface Props {
  project: Project;
}

const Chats = ({ project }: Props) => {
  const [chats, setChats] = useState<GroupChat[]>([]);
  const [loading, setLoading] = useState(true);

  const [clickedOnAddChat, setClickedOnAddChat] = useState(false);
  const [clickedOnEditChat, setClickedOnEditChat] = useState(false);
  const [clickedEditChat, setClickedEditChat] = useState(initialGroupChat);

  const user = useSelector(userSelector);

  const fetchChats = async () => {
    const URL = `${PROJECT_URL}/chats/${project.id}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setChats(res.data.chats);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  useEffect(() => {
    fetchChats();
  }, [project.id]);

  return (
    <div className="w-[70vw] max-lg:w-screen mx-auto flex flex-col gap-6">
      {clickedOnAddChat && <NewChat setShow={setClickedOnAddChat} project={project} setChats={setChats} />}
      {(project.userID == user.id || user.managerProjects.includes(project.id)) && (
        <div
          onClick={() => setClickedOnAddChat(true)}
          className="w-full max-md:w-taskbar_md h-taskbar text-gray-400 dark:text-gray-200 bg-white dark:bg-gradient-to-l dark:from-dark_primary_gradient_start dark:to-dark_primary_gradient_end px-4 max-md:px-2 py-3 rounded-lg cursor-pointer border-gray-300 border-[1px] dark:border-0 shadow-md hover:shadow-lg transition-ease-300 dark:hover:shadow-outer dark:shadow-outer flex justify-between items-center"
        >
          <div className="flex gap-2 items-center pl-2">
            <div className="font-primary dark:text-gray-200 text-lg">Create a new Chat</div>
          </div>
          <Plus
            size={36}
            className="dark:text-gray-200 flex-center rounded-full hover:bg-primary_comp_hover dark:hover:bg-[#e9e9e933] p-2 transition-ease-300"
            weight="regular"
          />
        </div>
      )}

      {loading ? (
        <Loader />
      ) : chats && chats.length > 0 ? (
        <div className="flex justify-evenly px-4 pb-4">
          <div className={`${clickedOnEditChat ? 'w-[40%]' : 'w-[720px]'} max-md:w-full flex flex-col gap-4`}>
            {chats.map(chat => {
              return (
                <ChatCard
                  key={chat.id}
                  chat={chat}
                  setClickedOnEditChat={setClickedOnEditChat}
                  clickedEditChat={clickedEditChat}
                  setClickedEditChat={setClickedEditChat}
                />
              );
            })}
          </div>
          {clickedOnEditChat && (
            <EditChat
              chat={clickedEditChat}
              project={project}
              setStateChats={setChats}
              setShow={setClickedOnEditChat}
            />
          )}
        </div>
      ) : (
        <NoChats />
      )}
    </div>
  );
};

export default Chats;
