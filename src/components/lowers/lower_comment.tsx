import React, { useState, useEffect } from 'react';
import { Comment } from '@/types';
import getHandler from '@/handlers/get_handler';
import { useDispatch, useSelector } from 'react-redux';
import { setLikes, userSelector } from '@/slices/userSlice';
import { COMMENT_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import Semaphore from '@/utils/semaphore';
import { configSelector, setUpdatingLikes } from '@/slices/configSlice';
import { HeartStraight, Repeat } from '@phosphor-icons/react';
import SignUp from '../common/signup_box';
import moment from 'moment';
import Image from 'next/image';
import Toaster from '@/utils/toaster';
import postHandler from '@/handlers/post_handler';
import { SERVER_ERROR } from '@/config/errors';
import CommentsLoader from '../loaders/comments';
import CommentComponent from '../common/comment';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
  comment: Comment;
  clickedOnReply: boolean;
  setClickedOnReply: React.Dispatch<React.SetStateAction<boolean>>;
}

const LowerComment = ({ comment, clickedOnReply, setClickedOnReply }: Props) => {
  const [liked, setLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(comment.noLikes);
  const [numReplies, setNumReplies] = useState(comment.noReplies);
  const [noUserClick, setNoUserClick] = useState(false);
  const [mutex, setMutex] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const limit = 10;

  const [replies, setReplies] = useState<Comment[]>([]);

  const [reply, setReply] = useState('');

  const user = useSelector(userSelector);
  const likes = user.likes;

  const dispatch = useDispatch();

  const updatingLikes = useSelector(configSelector).updatingLikes;

  const semaphore = new Semaphore(updatingLikes, setUpdatingLikes);

  useEffect(() => {
    if (likes.includes(comment.id)) setLiked(true);
    getReplies();
  }, []);

  const getReplies = async () => {
    if (mutex) return;

    setMutex(true);
    setLoading(true);
    const URL = `${COMMENT_URL}/replies/${comment.id}?page=${page}&limit=${limit}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode == 200) {
          const newReplies = [...replies, ...res.data.comments];
          if (newReplies.length === replies.length) setHasMore(false);
          setReplies(newReplies);
          setPage(prev => prev + 1);
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else {
            Toaster.error(SERVER_ERROR, 'error_toaster');
          }
        }
        setMutex(false);
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
        setMutex(false);
      });
  };

  const likeHandler = async () => {
    await semaphore.acquire();

    if (liked) setNumLikes(prev => prev - 1);
    else setNumLikes(prev => prev + 1);

    setLiked(prev => !prev);

    const URL = `${COMMENT_URL}/like/${comment.id}`;
    const res = await getHandler(URL);

    if (res.statusCode === 200) {
      const newLikes: string[] = [...likes];
      if (liked) newLikes.splice(newLikes.indexOf(comment.id), 1);
      else newLikes.push(comment.id);

      dispatch(setLikes(newLikes));
    } else {
      if (liked) setNumLikes(prev => prev + 1);
      else setNumLikes(prev => prev - 1);
      setLiked(prev => !prev);
    }

    semaphore.release();
  };

  const submitHandler = async () => {
    if (reply.trim() == '') return;
    const toaster = Toaster.startLoad('Adding your reply...');

    const formData = {
      commentID: comment.id,
      content: reply,
    };

    const res = await postHandler(COMMENT_URL, formData);
    if (res.statusCode === 201) {
      Toaster.stopLoad(toaster, 'Commented!', 1);
      setReplies([res.data.comment, ...replies]);
      setNumReplies(prev => prev + 1);
      setReply('');
    } else {
      if (res.data.message != '') Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
  };

  return (
    <>
      {noUserClick && <SignUp setShow={setNoUserClick} />}
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex items-center justify-between">
          <div className="flex gap-4 max-md:gap-3">
            <div className="flex-center gap-1">
              {numLikes > 0 && <div className="text-sm opacity-60">{numLikes}</div>}
              <HeartStraight
                onClick={() => {
                  if (user.id == '') setNoUserClick(true);
                  else likeHandler();
                }}
                className={`cursor-pointer max-md:w-6 max-md:h-6 ${
                  liked ? 'text-heart_filled' : 'text-black opacity-60'
                } transition-ease-300`}
                size={18}
                weight={liked ? 'fill' : 'regular'}
              />
            </div>
            {comment.level != 5 && (
              <div className="flex-center gap-1">
                {numReplies > 0 && <div className="text-sm opacity-60">{numReplies}</div>}
                <Repeat
                  onClick={() => {
                    if (user.id == '') setNoUserClick(true);
                    else setClickedOnReply(prev => !prev);
                  }}
                  className={`cursor-pointer max-md:w-6 max-md:h-6 ${
                    clickedOnReply ? 'text-blue-500' : 'text-black opacity-60'
                  } transition-ease-300`}
                  size={18}
                  weight={clickedOnReply ? 'duotone' : 'regular'}
                />
              </div>
            )}
          </div>
          <div className="text-xs max-md:text-xxs">• {moment(comment.createdAt).fromNow()}</div>
        </div>
        {clickedOnReply && (
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex gap-2">
              <Image
                crossOrigin="anonymous"
                className="w-6 h-6 rounded-full cursor-default mt-1"
                width={50}
                height={50}
                alt="user"
                src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
              />
              <div className="w-full flex justify-between gap-3 max-md:flex-col relative max-md:gap-2 max-md:items-end">
                <textarea
                  value={reply}
                  onChange={el => {
                    setReply(el.target.value);
                  }}
                  onKeyDown={el => {
                    if (el.key === 'Enter') submitHandler();
                  }}
                  className="w-5/6 text-sm border-[1px] border-dashed p-2 rounded-lg dark:text-white dark:bg-dark_primary_comp focus:outline-none min-h-[3rem] max-h-64 max-md:w-full"
                  placeholder="Reply to this comment"
                />
                <div
                  className="w-1/6 h-fit text-xs dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active font-medium border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-md py-2 px-3  flex-center cursor-pointer max-md:h-10 max-md:w-fit transition-ease-300"
                  onClick={submitHandler}
                >
                  Reply
                </div>
              </div>
            </div>
            <InfiniteScroll
              dataLength={replies.length}
              next={getReplies}
              hasMore={hasMore}
              loader={<CommentsLoader />}
              className="w-full flex flex-col gap-4"
            >
              {replies.map(comment => (
                <CommentComponent
                  key={comment.id}
                  comment={comment}
                  setComments={setReplies}
                  setNoComments={setNumReplies}
                />
              ))}
            </InfiniteScroll>
            {replies.length < comment.noReplies && (
              <div className="w-full text-center pt-4 text-sm">
                Comments which do not follow the guidelines are flagged.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default LowerComment;

