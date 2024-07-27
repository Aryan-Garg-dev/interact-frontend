import CopyClipboardButton from '@/components/buttons/copy_clipboard_btn';
import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import { MESSAGING_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import postHandler from '@/handlers/post_handler';
import { Chat, Post } from '@/types';
import { getMessagingUser } from '@/utils/funcs/messaging';
import renderContentWithLinks from '@/utils/funcs/render_content_with_links';
import Toaster from '@/utils/toaster';
import { X } from '@phosphor-icons/react';
import Cookies from 'js-cookie';
import moment from 'moment';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface Props {
  post: Post;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const SharePost = ({ post, setShow }: Props) => {
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
  }, [post]);

  useEffect(() => {
    if ((document.documentElement.style.overflowY = 'auto')) {
      document.documentElement.style.overflowY = 'hidden';
      document.documentElement.style.height = '100vh';

      return () => {
        document.documentElement.style.overflowY = 'auto';
        document.documentElement.style.height = 'auto';
      };
    }
  }, []);

  const handleSubmit = async () => {
    if (selectedChats.length == 0) {
      setShow(false);
      return;
    }
    const toaster = Toaster.startLoad('Sharing Post..');
    const URL = `/share/post/`;
    const formData = {
      content: message.trim() != '' ? message : 'Check Out this Post!',
      chats: selectedChats,
      postID: post.id,
    };
    const res = await postHandler(URL, formData);
    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'Post Shared!', 1);
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
      <div className="w-1/4 h-3/4 max-md:h-4/5 overflow-y-auto max-lg:w-5/6 fixed backdrop-blur-lg bg-[#ffffff] dark:bg-[#ffe1fc22] z-50 translate-x-1/2 -translate-y-1/4 top-64 right-1/2 flex flex-col px-8 py-8 gap-2 border-2 border-primary_btn dark:border-dark_primary_btn rounded-xl animate-fade_third">
        <div onClick={() => setShow(false)} className="md:hidden absolute top-2 right-2">
          <X size={24} weight="bold" />
        </div>
        <div className="text-3xl text-center text-gray-900 font-bold">Share this Post</div>
        <div className="w-full font-primary flex gap-1 mt-4 border-primary_btn dark:border-dark_primary_btn border-[1px] dark:text-white rounded-xl p-2 max-md:px-4 max-md:py-4">
          <div className="h-full">
            <div className="rounded-full">
              <Image
                crossOrigin="anonymous"
                width={50}
                height={50}
                alt={'User Pic'}
                src={`${USER_PROFILE_PIC_URL}/${post.user.profilePic}`}
                className={'rounded-full w-8 h-8'}
              />
            </div>
          </div>
          <div className="w-[calc(100%-32px)] flex flex-col gap-1">
            <div className="w-full h-fit flex justify-between items-center">
              <div className="font-medium">{post.user.username}</div>
              <div className="flex gap-2 font-light text-xxs">{moment(post.postedAt).fromNow()}</div>
            </div>
            <div className="w-full text-xs  whitespace-pre-wrap mb-2 line-clamp-8">
              {renderContentWithLinks(post.content, post.taggedUsers)}
            </div>
          </div>
        </div>{' '}
        <div className="w-full h-[400px] overflow-y-auto flex flex-col justify-between gap-2">
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
                <CopyClipboardButton url={`explore/post/${post.id}`} />
              </div>
            </>
          ) : (
            <div className="font-medium text-xl m-auto">No chat present :(</div>
          )}
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className=" bg-backdrop w-screen h-screen fixed top-0 right-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default SharePost;
