import React, { useState, useEffect } from 'react';
import { COMMENT_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import Toaster from '@/utils/toaster';
import Image from 'next/image';
import { Announcement, Comment, Event, Post, Project } from '@/types';
import getHandler from '@/handlers/get_handler';
import { userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';
import postHandler from '@/handlers/post_handler';
import socketService from '@/config/ws';
import { SERVER_ERROR } from '@/config/errors';
import CommentsLoader from '../loaders/comments';
import CommentComponent from './comment';

interface Props {
  type: string;
  item: Project | Post | Event | Announcement;
  setNoComments: React.Dispatch<React.SetStateAction<number>>;
}

const CommentBox = ({ type, item, setNoComments }: Props) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState<Comment[]>([]);

  const [commentBody, setCommentBody] = useState('');

  const limit = 10;

  useEffect(() => {
    getComments();
  }, [item]);

  const getComments = async () => {
    setLoading(true);
    const URL = `${COMMENT_URL}/${type}/${item.id}?page=${page}&limit=${limit}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode == 200) {
          const newComments = [...comments, ...res.data.comments];
          if (newComments.length === comments.length) setHasMore(false);
          setComments(newComments);
          setPage(prev => prev + 1);

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
  };

  const submitHandler = async () => {
    if (commentBody.trim() == '') return;
    const toaster = Toaster.startLoad('Adding your comment...');

    const formData =
      type === 'post'
        ? {
            postID: item.id,
            content: commentBody,
          }
        : type === 'project'
        ? {
            projectID: item.id,
            content: commentBody,
          }
        : type === 'event'
        ? {
            eventID: item.id,
            content: commentBody,
          }
        : type === 'announcement'
        ? {
            announcementID: item.id,
            content: commentBody,
          }
        : {};

    const res = await postHandler(COMMENT_URL, formData);
    if (res.statusCode === 201) {
      Toaster.stopLoad(toaster, 'Commented!', 1);
      const newComments = [res.data.comment, ...comments];
      setComments(newComments);
      setNoComments(prev => prev + 1);
      setCommentBody('');
      if (item.userID && item.userID != loggedInUser.id)
        socketService.sendNotification(item.userID, `${loggedInUser.name} commented on your ${type}!`);
    } else {
      if (res.data.message != '') Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
  };

  const loggedInUser = useSelector(userSelector);

  return (
    <div className="w-full h-full overflow-y-auto flex flex-col over p-4 font-primary gap-4 max-md:px-4">
      <div className="w-full flex gap-2">
        <Image
          crossOrigin="anonymous"
          className="w-8 h-8 rounded-full cursor-default mt-2"
          width={50}
          height={50}
          alt="user"
          src={`${USER_PROFILE_PIC_URL}/${loggedInUser.profilePic}`}
        />
        <div className="w-full flex justify-between gap-3 max-md:flex-col relative max-md:gap-2 max-md:items-end">
          <textarea
            value={commentBody}
            onChange={el => {
              setCommentBody(el.target.value);
            }}
            onKeyDown={el => {
              if (el.key === 'Enter') submitHandler();
            }}
            className="w-5/6 max-md:text-sm border-[1px] border-dashed p-2 rounded-lg dark:text-white dark:bg-dark_primary_comp focus:outline-none min-h-[3rem] max-h-64 max-md:w-full"
            placeholder={`Comment on this ${type}`}
          />
          <div
            className="w-1/6 h-fit text-sm max-md:text-xs dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active font-medium border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-md py-2 px-3  flex-center cursor-pointer max-md:h-10 max-md:w-fit transition-ease-300"
            onClick={submitHandler}
          >
            Comment
          </div>
        </div>
      </div>
      {loading && page == 1 ? (
        <CommentsLoader />
      ) : comments.length > 0 ? (
        <div className="w-full flex flex-col gap-4">
          {comments.map(comment => (
            <CommentComponent
              key={comment.id}
              comment={comment}
              setComments={setComments}
              setNoComments={setNoComments}
            />
          ))}
          {loading ? (
            <CommentsLoader />
          ) : comments.length % limit == 0 && hasMore ? (
            <div
              onClick={getComments}
              className="w-fit mx-auto pt-4 text-xs text-gray-700 font-medium hover-underline-animation after:bg-gray-700 cursor-pointer"
            >
              Load More
            </div>
          ) : (
            comments.length < item.noComments && (
              <div className="w-full text-center pt-4 text-sm">
                Comments are do not follow the guidelines are flagged.
              </div>
            )
          )}
        </div>
      ) : item.noComments == 0 ? (
        <div className="w-fit mx-auto text-xl"> No Comments Yet :)</div>
      ) : (
        <div className="w-full text-center pt-4 text-sm">Comments are do not follow the guidelines are flagged.</div>
      )}
    </div>
  );
};

export default CommentBox;
