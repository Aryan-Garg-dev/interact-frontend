import CopyClipboardButton from '@/components/buttons/copy_clipboard_btn';
import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import { MESSAGING_URL, PROJECT_PIC_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import postHandler from '@/handlers/post_handler';
import { Chat, Project } from '@/types';
import { getMessagingUser } from '@/utils/funcs/messaging';
import Toaster from '@/utils/toaster';
import { X } from '@phosphor-icons/react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface Props {
  project: Project;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setNoShares?: React.Dispatch<React.SetStateAction<number>>;
}

const ShareProject = ({ project, setShow, setNoShares }: Props) => {
  const userID = Cookies.get('id');
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (userID === '') {
      Toaster.error('You are not logged In.');
      return;
    }

    const URL = `${MESSAGING_URL}/personal`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const chatsData: Chat[] = res.data.chats;

          setChats(chatsData || []);
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else {
            Toaster.error(SERVER_ERROR, 'error_toaster');
          }
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  }, [project]);

  const handleSubmit = async () => {
    if (selectedChats.length == 0) {
      setShow(false);
      return;
    }
    const toaster = Toaster.startLoad('Sharing Project..');
    const URL = `/share/project/`;
    const formData = {
      content: message.trim() != '' ? message : 'Check Out this Project!',
      chats: selectedChats,
      projectID: project.id,
    };
    const res = await postHandler(URL, formData);
    if (res.statusCode === 200) {
      if (setNoShares) setNoShares(prev => prev + 1);
      Toaster.stopLoad(toaster, 'Project Shared!', 1);
      setShow(false);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
  };

  const handleSelectChat = (chatID: string) => {
    if (selectedChats.includes(chatID)) setSelectedChats(prev => prev.filter(id => id != chatID));
    else setSelectedChats([...selectedChats, chatID]);
  };

  return (
    <>
      <div className="w-1/2 max-md:h-5/6 overflow-y-auto max-lg:w-5/6 fixed backdrop-blur-lg bg-white bg-[#1201103c] z-30 translate-x-1/2 -translate-y-1/4 top-64 max-lg:top-1/4 max-md:top-56 right-1/2 flex flex-col px-8 py-6 gap-6 border-2 dark:border-dark_primary_btn rounded-xl animate-fade_third">
        <div onClick={() => setShow(false)} className="md:hidden absolute top-2 right-2">
          <X size={24} weight="bold" />
        </div>
        <div className="text-3xl text-center text-gray-900 font-bold">Share this Project</div>
        <div className="w-full flex max-lg:flex-col gap-4 items-center">
          <div className="w-1/2 max-md:w-full font-primary  border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg p-4 flex flex-col items-center justify-center gap-4 max-lg:gap-4 transition-ease-300 cursor-default">
            <Image
              crossOrigin="anonymous"
              width={100}
              height={100}
              alt={'User Pic'}
              src={`${PROJECT_PIC_URL}/${project.coverPic}`}
              className={'w-[240px] h-[240px] max-lg:w-[120px] max-lg:h-[120px] rounded-lg object-cover'}
              placeholder="blur"
              blurDataURL={project.blurHash || 'no-hash'}
            />

            <div className="w-full flex flex-col items-center gap-1">
              <div className="font-bold line-clamp-2 text-center text-3xl text-gradient">{project.title}</div>
              <div className="text-sm font-medium">{project.tagline}</div>
            </div>
            <CopyClipboardButton url={`explore?pid=${project.slug}?action=external`} />
          </div>
          <div className="w-1/2 max-lg:w-full h-[400px] overflow-auto flex flex-col justify-between gap-2">
            {loading ? (
              <Loader />
            ) : chats.length > 0 ? (
              <>
                <div className="w-full flex flex-col gap-2">
                  {chats.map(chat => {
                    return (
                      <div
                        key={chat.id}
                        onClick={() => {
                          handleSelectChat(chat.id);
                        }}
                        className={`w-full flex gap-2 rounded-lg py-2 px-2 cursor-pointer ${
                          selectedChats.includes(chat.id)
                            ? 'bg-primary_comp_hover dark:bg-[#ffe1fc22]'
                            : 'hover:bg-primary_comp dark:hover:bg-[#ffe1fc10]'
                        } transition-all ease-in-out duration-200`}
                      >
                        <Image
                          crossOrigin="anonymous"
                          width={50}
                          height={50}
                          alt={'User Pic'}
                          src={`${USER_PROFILE_PIC_URL}/${getMessagingUser(chat).profilePic}`}
                          className={'rounded-full w-12 h-12 cursor-pointer border-[1px] border-black'}
                        />
                        <div className="w-5/6 flex flex-col">
                          <div className="text-lg font-bold">{getMessagingUser(chat).name}</div>
                          <div className="text-sm">@{getMessagingUser(chat).username}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="w-full flex flex-col gap-1">
                  <textarea
                    className="bg-primary_comp dark:bg-[#ffe1fc22] text-sm focus:outline-none p-2 rounded-xl min-h-[6rem] max-h-64"
                    placeholder="Add a message"
                    value={message}
                    onChange={el => setMessage(el.target.value)}
                  />
                  <div
                    onClick={handleSubmit}
                    className="w-full text-center py-2 rounded-lg border-[1px] bg-primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active border-[#ffe1fc10] dark:hover:bg-[#ffe1fc10] cursor-pointer transition-ease-200"
                  >
                    Send Message
                  </div>
                </div>
              </>
            ) : (
              <div className="font-medium text-xl m-auto">No chat present :(</div>
            )}
          </div>
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className=" bg-backdrop w-screen h-screen fixed top-0 right-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default ShareProject;
