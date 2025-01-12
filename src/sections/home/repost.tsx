import { SERVER_ERROR } from '@/config/errors';
import { ORG_URL, POST_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';
import { Announcement, Poll, Post } from '@/types';
import { currentOrgIDSelector } from '@/slices/orgSlice';
import moment from 'moment';
import ModalWrapper from '@/wrappers/modal';
import Editor from '@/components/editor';

interface Props {
  post: Post;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setFeed?: React.Dispatch<React.SetStateAction<(Post | Announcement | Poll)[]>>;
  org?: boolean;
}

const RePost = ({ post, setShow, setFeed, org = false }: Props) => {
  const [content, setContent] = useState<string>('');

  const user = useSelector(userSelector);

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  const currentOrgID = useSelector(currentOrgIDSelector);

  const handleSubmit = async () => {
    if (content.trim() == '') {
      Toaster.error('Caption cannot be empty!');
      return;
    }
    if (content.length > 1000) {
      Toaster.error('Caption can only be 1000 characters long!');
      return;
    }

    const toaster = Toaster.startLoad('Adding your Post..');
    const formData = new FormData();

    formData.append('content', content.replace(/\n{3,}/g, '\n\n'));
    formData.append('rePostID', post.id);

    const URL = org ? `${ORG_URL}/${currentOrgID}/posts` : POST_URL;

    const res = await postHandler(URL, formData, 'multipart/form-data');

    if (res.statusCode === 201) {
      setContent('');
      setShow(false);
      if (setFeed) setFeed(prev => [res.data.post, ...prev]);
      Toaster.stopLoad(toaster, 'Posted!', 1);
      setShow(false);
    } else {
      if (res.data.message) {
        Toaster.stopLoad(toaster, res.data.message, 0);
      } else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
  };

  return (
    <ModalWrapper setShow={setShow} top="1/2" width="2/3" height="2/3" blur={true} border={false}>
      <div className="w-full flex gap-4 max-md:w-full">
        <Image
          crossOrigin="anonymous"
          className="max-md:hidden w-16 h-16 rounded-full"
          width={100}
          height={100}
          alt="user"
          src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
        />
        <div className="grow flex flex-col gap-2">
          <div className="flex max-md:flex-col justify-between items-center max-md:items-start">
            <div className="flex items-center gap-2">
              <Image
                crossOrigin="anonymous"
                className="md:hidden w-16 h-16 rounded-full"
                width={100}
                height={100}
                alt="user"
                src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
              />
              <div className="flex flex-col">
                <div className="text-2xl font-semibold">{user.name}</div>
                <div className="font-medium">@{user.username}</div>
              </div>
            </div>

            <div
              onClick={handleSubmit}
              className="max-md:hidden w-[120px] h-[48px] bg-primary_comp dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active transition-ease-300 shrink-0 flex-center text-lg font-semibold rounded-lg cursor-pointer"
            >
              Post
            </div>
          </div>

          <div className="w-4/5 max-lg:w-full font-primary flex gap-1 mt-4 border-primary_btn dark:border-dark_primary_btn border-[1px] dark:text-white rounded-xl p-2 max-md:px-4 max-md:py-4">
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
              <Editor
                className="w-full text-xs whitespace-pre-wrap mb-2 line-clamp-8"
                content={post.content}
                editable={false}
              />
            </div>
          </div>
          <Editor
            editable
            setContent={setContent}
            placeholder="Add to conversation..."
            limit={2000}
            className="min-h-[350px]"
          />
        </div>
      </div>

      <div
        onClick={handleSubmit}
        className="md:hidden w-[120px] h-[48px] bg-primary_comp dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active transition-ease-300 shrink-0 flex-center text-lg font-semibold rounded-lg cursor-pointer"
      >
        Post
      </div>
    </ModalWrapper>
  );
};

export default RePost;
