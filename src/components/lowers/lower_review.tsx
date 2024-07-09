import { ORG_URL, PROJECT_URL } from '@/config/routes';
import socketService from '@/config/ws';
import getHandler from '@/handlers/get_handler';
import { configSelector, setUpdatingLikes } from '@/slices/configSlice';
import { userSelector, userIDSelector, setLikes, setDisLikes } from '@/slices/userSlice';
import Semaphore from '@/utils/semaphore';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Review } from '@/types';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import SignUp from '../common/signup_box';

interface Props {
  review: Review;
}

const LowerReview = ({ review }: Props) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const [numUpVotes, setNumUpVotes] = useState(review.noUpVotes);
  const [numDownVotes, setNumDownVotes] = useState(review.noDownVotes);

  const [noUserClick, setNoUserClick] = useState(false);

  const user = useSelector(userSelector);
  const likes = user.likes;
  const dislikes = user.dislikes;

  const dispatch = useDispatch();

  const updatingLikes = useSelector(configSelector).updatingLikes;

  const semaphore = new Semaphore(updatingLikes, setUpdatingLikes);

  const userID = useSelector(userIDSelector) || '';

  useEffect(() => {
    if (likes.includes(review.id)) setLiked(true);
    else if (dislikes.includes(review.id)) setDisliked(true);
  }, []);

  const likeHandler = async () => {
    await semaphore.acquire();

    if (liked) setNumUpVotes(prev => prev - 1);
    else setNumUpVotes(prev => prev + 1);

    setLiked(prev => !prev);

    const URL = `${ORG_URL}/${review.organizationID}/reviews/like/${review.id}`;
    const res = await getHandler(URL);

    if (res.statusCode === 200) {
      const newLikes: string[] = [...likes];
      if (liked) {
        newLikes.splice(newLikes.indexOf(review.id), 1);
      } else {
        newLikes.push(review.id);
        if (review.userID != user.id) socketService.sendNotification(review.userID, `${user.name} liked your review!`);

        if (disliked) {
          const newDisLikes: string[] = [...dislikes];
          newDisLikes.splice(newDisLikes.indexOf(review.id), 1);
          dispatch(setDisLikes(newDisLikes));
          setNumDownVotes(prev => prev - 1);
          setDisliked(false);
        }
      }

      dispatch(setLikes(newLikes));
    } else {
      if (liked) setNumUpVotes(prev => prev + 1);
      else setNumUpVotes(prev => prev - 1);
      setLiked(prev => !prev);
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
    }

    semaphore.release();
  };

  const dislikeHandler = async () => {
    await semaphore.acquire();

    if (disliked) setNumDownVotes(prev => prev - 1);
    else setNumDownVotes(prev => prev + 1);

    setDisliked(prev => !prev);

    const URL = `${ORG_URL}/${review.organizationID}/reviews/dislike/${review.id}`;
    const res = await getHandler(URL);

    if (res.statusCode === 200) {
      const newDisLikes: string[] = [...dislikes];
      if (disliked) {
        newDisLikes.splice(newDisLikes.indexOf(review.id), 1);
      } else {
        newDisLikes.push(review.id);

        if (liked) {
          const newLikes: string[] = [...likes];
          newLikes.splice(newLikes.indexOf(review.id), 1);
          dispatch(setLikes(newLikes));
          setNumUpVotes(prev => prev - 1);
          setLiked(false);
        }
      }

      dispatch(setDisLikes(newDisLikes));
    } else {
      if (disliked) setNumDownVotes(prev => prev + 1);
      else setNumDownVotes(prev => prev - 1);
      setDisliked(prev => !prev);
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
    }

    semaphore.release();
  };

  return (
    <div className="flex items-center gap-4">
      {noUserClick ? <SignUp setShow={setNoUserClick} /> : <></>}
      <div
        onClick={() => {
          if (userID == '') setNoUserClick(true);
          else likeHandler();
        }}
        className={`flex items-center gap-1 ${
          liked ? 'shadow-xl text-white bg-primary_text' : 'hover:shadow-xl'
        } px-2 py-1 rounded-lg cursor-pointer transition-ease-300 font-medium`}
      >
        <CaretUp size={20} weight="bold" />
        <div>{numUpVotes}</div>
      </div>
      <div
        onClick={() => {
          if (userID == '') setNoUserClick(true);
          else dislikeHandler();
        }}
        className={`flex items-center gap-1 ${
          disliked ? 'shadow-xl text-white bg-red-400' : 'hover:shadow-xl'
        } px-2 py-1 rounded-lg cursor-pointer transition-ease-300`}
      >
        <CaretDown size={20} weight="bold" />
        <div>{numDownVotes}</div>
      </div>
    </div>
  );
};

export default LowerReview;
