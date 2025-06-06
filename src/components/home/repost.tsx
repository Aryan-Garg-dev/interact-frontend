import React, { useState } from 'react';
import Image from 'next/image';
import { Post } from '@/types';
import { ORG_URL, POST_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import moment from 'moment';
import Link from 'next/link';
import LowerPost from '../lowers/lower_post';
import { userIDSelector, userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';
import PostComponent from './post';
import deleteHandler from '@/handlers/delete_handler';
import Toaster from '@/utils/toaster';
import patchHandler from '@/handlers/patch_handler';
import { SERVER_ERROR } from '@/config/errors';
import ConfirmDelete from '../common/confirm_delete';
import renderContentWithLinks from '@/utils/funcs/render_content_with_links';
import Report from '../common/report';
import SignUp from '../common/signup_box';
import { currentOrgIDSelector } from '@/slices/orgSlice';
import checkOrgAccess from '@/utils/funcs/access';
import { ORG_SENIOR } from '@/config/constants';
import { Buildings } from '@phosphor-icons/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Props {
  post: Post;
  showLowerPost?: boolean;
  setFeed?: React.Dispatch<React.SetStateAction<any[]>>;
  org?: boolean;
}

const RePost = ({ post, showLowerPost = true, setFeed, org = false }: Props) => {
  const loggedInUser = useSelector(userSelector);
  const [clickedOnEdit, setClickedOnEdit] = useState(false);
  const [clickedOnDelete, setClickedOnDelete] = useState(false);
  const [clickedOnReport, setClickedOnReport] = useState(false);

  const [noUserClick, setNoUserClick] = useState(false);

  const [caption, setCaption] = useState(post.content);

  const userID = useSelector(userIDSelector) || '';

  const handleDelete = async () => {
    const toaster = Toaster.startLoad('Deleting your post...');

    const URL = org ? `${ORG_URL}/${currentOrgID}/posts/${post.id}` : `${POST_URL}/${post.id}`;

    const res = await deleteHandler(URL);

    if (res.statusCode === 204) {
      if (setFeed) setFeed(prev => prev.filter(p => p.id != post.id));
      setClickedOnDelete(false);
      Toaster.stopLoad(toaster, 'Post Deleted', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'b' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      wrapSelectedText('**', '**');
    }
  };

  const wrapSelectedText = (prefix: string, suffix: string) => {
    const textarea = document.getElementById('textarea_id') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = caption.substring(start, end);
    const newText = caption.substring(0, start) + prefix + selectedText + suffix + caption.substring(end);
    setCaption(newText);
    textarea.focus();
    textarea.setSelectionRange(start + prefix.length, end + prefix.length);
  };

  const currentOrgID = useSelector(currentOrgIDSelector);

  const handleEdit = async () => {
    if (caption == post.content || caption.trim().length == 0 || caption.replace(/\n/g, '').length == 0) {
      setClickedOnEdit(false);
      return;
    }
    const toaster = Toaster.startLoad('Editing Post...');

    const URL = org ? `${ORG_URL}/${currentOrgID}/posts/${post.id}` : `${POST_URL}/${post.id}`;

    const formData = {
      content: caption.replace(/\n{3,}/g, '\n\n'),
    };

    const res = await patchHandler(URL, formData);
    if (res.statusCode === 200) {
      if (setFeed)
        setFeed(prev =>
          prev.map(p => {
            if (p.id == post.id) return { ...p, content: caption.replace(/\n{3,}/g, '\n\n'), edited: true };
            else return p;
          })
        );
      setClickedOnEdit(false);
      Toaster.stopLoad(toaster, 'Post Edited', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };

  return (
    <div className="w-full relative overflow-clip bg-white dark:bg-transparent font-primary flex gap-1 border-b-[1px] border-gray-300 dark:border-dark_primary_btn py-4 animate-fade_third">
      {noUserClick && <SignUp setShow={setNoUserClick} />}
      {clickedOnDelete && <ConfirmDelete setShow={setClickedOnDelete} handleDelete={handleDelete} />}
      {clickedOnReport && <Report postID={post.id} setShow={setClickedOnReport} />}
      <div className="h-full">
        <Link
          href={`/users/${post.user.isOrganization ? 'organisations/' : ''}${post.user.username}`}
          className="rounded-full"
        >
          <Image
            crossOrigin="anonymous"
            width={50}
            height={50}
            alt={'User Pic'}
            src={`${USER_PROFILE_PIC_URL}/${post.user.profilePic}`}
            placeholder="blur"
            blurDataURL={post.user.profilePicBlurHash || 'no-hash'}
            className="rounded-full w-8 h-8"
          />
        </Link>
      </div>
      <div className="w-[calc(100%-32px)] flex flex-col gap-1">
        <div className="w-full h-fit flex justify-between">
          <Link
            href={`${post.user.isOrganization ? 'organisations' : 'users'}/${post.user.username}`}
            className="font-medium flex items-center gap-1"
          >
            {post.user.name}
            {post.user.isOrganization ? <Buildings weight="duotone" /> : <></>}
            <div className="text-xs font-normal text-gray-500">@{post.user.username}</div>
          </Link>
          <div className="flex gap-2 text-xs text-gray-400">
            <div>{moment(post.postedAt).fromNow()}</div>
            {!clickedOnEdit && showLowerPost && (
              <Popover>
                <PopoverTrigger>
                  <div className="text-xxs cursor-pointer">•••</div>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2 text-sm">
                  {(post.userID == loggedInUser.id || checkOrgAccess(ORG_SENIOR)) && (
                    <div
                      onClick={() => setClickedOnEdit(true)}
                      className="w-full px-4 py-2 max-md:p-1 max-md:text-center hover:bg-primary_comp dark:hover:bg-dark_primary_comp_hover rounded-lg cursor-pointer transition-ease-300"
                    >
                      Edit
                    </div>
                  )}
                  {(post.userID == loggedInUser.id || checkOrgAccess(ORG_SENIOR)) && (
                    <div
                      onClick={el => {
                        el.stopPropagation();
                        setClickedOnDelete(true);
                      }}
                      className="w-full px-4 py-2 max-md:p-1 max-md:text-center hover:bg-primary_comp dark:hover:bg-dark_primary_comp_hover hover:text-primary_danger rounded-lg cursor-pointer transition-ease-100 "
                    >
                      Delete
                    </div>
                  )}
                  {post.userID != loggedInUser.id && (
                    <div
                      onClick={el => {
                        el.stopPropagation();
                        if (userID == '') setNoUserClick(true);
                        else setClickedOnReport(true);
                      }}
                      className="w-full px-4 py-2 max-md:p-1 max-md:text-center hover:bg-primary_comp dark:hover:bg-dark_primary_comp_hover hover:text-primary_danger rounded-lg cursor-pointer transition-ease-100 "
                    >
                      Report
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {post.isRePost && post.rePost ? (
          <PostComponent post={post.rePost} isRepost={true} key={post.id} />
        ) : (
          <div className="border-[1px] rounded-lg p-2 text-sm font-medium">* This post has been deleted *</div>
        )}

        {clickedOnEdit ? (
          <div className="relative">
            <textarea
              id="textarea_id"
              maxLength={2000}
              value={caption}
              autoFocus={true}
              onChange={el => setCaption(el.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full text-sm whitespace-pre-wrap rounded-md focus:outline-none dark:bg-dark_primary_comp p-2 my-2 max-h-72"
            />

            <div className="dark:text-white flex items-center gap-4 absolute -bottom-8 right-0">
              <div
                onClick={() => setClickedOnEdit(false)}
                className="text-sm hover-underline-animation after:bg-black dark:after:bg-white cursor-pointer"
              >
                cancel
              </div>
              <div
                onClick={handleEdit}
                className="text-sm hover:text-primary_text dark:hover:text-dark_primary_btn cursor-pointer transition-ease-200"
              >
                save
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full text-sm whitespace-pre-wrap mb-2">
            {renderContentWithLinks(post.content, post.taggedUsers)}
          </div>
        )}
        {showLowerPost && <LowerPost post={post} />}
      </div>
    </div>
  );
};

export default RePost;
