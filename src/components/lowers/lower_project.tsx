import React, { useState, useEffect } from 'react';
import { Project, ProjectBookmark } from '@/types';
import deleteHandler from '@/handlers/delete_handler';
import getHandler from '@/handlers/get_handler';
import { useDispatch, useSelector } from 'react-redux';
import { setLikes, setProjectBookmarks, userIDSelector, userSelector } from '@/slices/userSlice';
import { BookmarkSimple, ChatTeardrop, Export } from '@phosphor-icons/react';
import BookmarkProject from '../../sections/lowers/bookmark_project';
import { BOOKMARK_URL, PROJECT_URL } from '@/config/routes';
import Semaphore from '@/utils/semaphore';
import { configSelector, setUpdateBookmark, setUpdatingLikes } from '@/slices/configSlice';
import { HeartStraight, WarningCircle } from '@phosphor-icons/react';
import CommentProject from '@/sections/lowers/comment_project';
import socketService from '@/config/ws';
import Report from '../common/report';
import Toaster from '@/utils/toaster';
import SignUp from '../common/signup_box';
import Share from '@/sections/lowers/share';
import ProjectCard from '../cards/project';

interface Props {
  project: Project;
  initialCommentShowState?: boolean;
}

interface bookMarkStatus {
  isBookmarked: boolean;
  projectItemID: string;
  bookmarkID: string;
}

const LowerProject = ({ project, initialCommentShowState = false }: Props) => {
  const [liked, setLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(project.noLikes);
  const [numComments, setNumComments] = useState(project.noComments);
  const [bookmarkStatus, setBookmarkStatus] = useState<bookMarkStatus>({
    isBookmarked: false,
    projectItemID: '',
    bookmarkID: '',
  });
  const [clickedOnComment, setClickedOnComment] = useState(initialCommentShowState);
  const [clickedOnShare, setClickedOnShare] = useState(false);
  const [clickedOnBookmark, setClickedOnBookmark] = useState(false);
  const [clickedOnReport, setClickedOnReport] = useState(false);
  const [mutex, setMutex] = useState(false);

  const [noUserClick, setNoUserClick] = useState(false);

  const user = useSelector(userSelector);
  const likes = user.likes;
  const bookmarks = user.projectBookmarks || [];

  const dispatch = useDispatch();

  const updatingLikes = useSelector(configSelector).updatingLikes;

  const semaphore = new Semaphore(updatingLikes, setUpdatingLikes);

  const userID = useSelector(userIDSelector) || '';

  const setBookmark = (isBookmarked: boolean, projectItemID: string, bookmarkID: string) => {
    setBookmarkStatus({
      isBookmarked,
      projectItemID,
      bookmarkID,
    });
  };

  function removePostItemFromBookmark(
    bookmarks: ProjectBookmark[],
    bookmarkId: string,
    projectItemId: string
  ): ProjectBookmark[] {
    const updatedBookmarks = bookmarks.map(bookmark => {
      if (bookmark.id === bookmarkId) {
        const updatedPostItems = bookmark.projectItems.filter(item => item.id !== projectItemId);
        return { ...bookmark, projectItems: updatedPostItems };
      }
      return bookmark;
    });

    return updatedBookmarks;
  }

  useEffect(() => {
    if (likes.includes(project.id)) setLiked(true);
    bookmarks.forEach(bookmarksObj => {
      if (bookmarksObj.projectItems)
        bookmarksObj.projectItems.forEach(projectItem => {
          if (projectItem.projectID == project.id) setBookmark(true, projectItem.id, bookmarksObj.id);
        });
    });
  }, []);

  const likeHandler = async () => {
    await semaphore.acquire();

    if (liked) setNumLikes(prev => prev - 1);
    else setNumLikes(prev => prev + 1);

    setLiked(prev => !prev);

    const URL = `${PROJECT_URL}/like/${project.id}`;
    const res = await getHandler(URL);

    if (res.statusCode === 200) {
      const newLikes: string[] = [...likes];
      if (liked) {
        newLikes.splice(newLikes.indexOf(project.id), 1);
      } else {
        newLikes.push(project.id);
        if (project.userID != user.id)
          socketService.sendNotification(project.userID, `${user.name} liked your project!`);
      }
      dispatch(setLikes(newLikes));
    } else {
      if (liked) setNumLikes(prev => prev + 1);
      else setNumLikes(prev => prev - 1);
      setLiked(prev => !prev);
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
    }

    semaphore.release();
  };

  const removeBookmarkItemHandler = async () => {
    if (mutex) return;
    setMutex(true);
    setBookmark(false, bookmarkStatus.projectItemID, bookmarkStatus.bookmarkID);

    const URL = `${BOOKMARK_URL}/project/item/${bookmarkStatus.projectItemID}`;
    const res = await deleteHandler(URL);
    if (res.statusCode === 204) {
      const updatedBookmarks = removePostItemFromBookmark(
        bookmarks,
        bookmarkStatus.bookmarkID,
        bookmarkStatus.projectItemID
      );
      dispatch(setProjectBookmarks(updatedBookmarks));
      setBookmark(false, '', '');
      dispatch(setUpdateBookmark(true));
    } else {
      setBookmark(true, bookmarkStatus.projectItemID, bookmarkStatus.bookmarkID);
    }
    setMutex(false);
  };

  return (
    <>
      {noUserClick && <SignUp setShow={setNoUserClick} />}
      {clickedOnComment && (
        <CommentProject
          setShow={setClickedOnComment}
          project={project}
          numComments={numComments}
          setNoComments={setNumComments}
        />
      )}
      {clickedOnShare && (
        <Share
          itemID={project.id}
          itemType="project"
          setShow={setClickedOnShare}
          clipboardURL={`explore?pid=${project.slug}&action=external`}
          item={<ProjectCard project={project} />}
        />
      )}
      {clickedOnReport && <Report projectID={project.id} setShow={setClickedOnReport} />}

      <div className="flex flex-col gap-12 max-lg:gap-2 max-lg:flex-row">
        <BookmarkProject
          show={clickedOnBookmark}
          setShow={setClickedOnBookmark}
          project={project}
          setBookmark={setBookmark}
        />
        <BookmarkSimple
          className="cursor-pointer max-lg:w-6 max-lg:h-6"
          onClick={() => {
            if (userID == '') setNoUserClick(true);
            else {
              if (bookmarkStatus.isBookmarked) removeBookmarkItemHandler();
              else setClickedOnBookmark(prev => !prev);
            }
          }}
          size={32}
          weight={bookmarkStatus.isBookmarked ? 'fill' : 'light'}
          fill={bookmarkStatus.isBookmarked ? '#478EE1' : '#000000'}
        />
        <HeartStraight
          onClick={() => {
            if (userID == '') setNoUserClick(true);
            else likeHandler();
          }}
          className={`cursor-pointer max-md:w-6 max-md:h-6 ${
            liked ? 'text-heart_filled' : 'text-black opacity-60'
          } transition-ease-300`}
          size={32}
          weight={liked ? 'fill' : 'regular'}
        />
        <Export
          onClick={() => {
            if (userID == '') setNoUserClick(true);
            else setClickedOnShare(true);
          }}
          className="cursor-pointer max-lg:w-6 max-lg:h-6"
          size={32}
          weight="regular"
        />
        <ChatTeardrop
          onClick={() => {
            if (userID == '') setNoUserClick(true);
            else setClickedOnComment(true);
          }}
          className="cursor-pointer max-lg:w-6 max-lg:h-6"
          size={32}
        />
        {project.userID != user.id && (
          <WarningCircle
            onClick={() => {
              if (userID == '') setNoUserClick(true);
              else setClickedOnReport(true);
            }}
            className="cursor-pointer max-lg:w-6 max-lg:h-6"
            size={32}
          />
        )}
      </div>
    </>
  );
};

export default LowerProject;
