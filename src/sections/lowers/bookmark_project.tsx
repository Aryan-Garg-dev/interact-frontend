import postHandler from '@/handlers/post_handler';
import { setProjectBookmarks, userSelector } from '@/slices/userSlice';
import { GenericBookmark, Project, ProjectBookmark, ProjectBookmarkItem } from '@/types';
import Toaster from '@/utils/toaster';
import React, { FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BOOKMARK_URL } from '@/config/routes';
import { SERVER_ERROR } from '@/config/errors';
import BookmarkModal from '@/components/common/bookmark_modal';

interface Props {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  project: Project;
  setBookmark: (isBookmarked: boolean, projectItemID: string, bookmarkID: string) => void;
}

const BookmarkProject = ({ show, setShow, project, setBookmark }: Props) => {
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const [mutex, setMutex] = useState(false);
  const dispatch = useDispatch();

  const bookmarks = useSelector(userSelector).projectBookmarks || [];

  const addBookmarkHandler = async (el: FormEvent<HTMLFormElement>) => {
    el.preventDefault();
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Adding your Bookmark...');

    const URL = `${BOOKMARK_URL}/project`;
    const res = await postHandler(URL, { title: bookmarkTitle });

    if (res.statusCode === 201) {
      const bookmark: ProjectBookmark = res.data.bookmark;
      const updatedBookmarks = [...bookmarks, bookmark];
      dispatch(setProjectBookmarks(updatedBookmarks));
      Toaster.stopLoad(toaster, 'Bookmark Added', 1);
      setBookmarkTitle('');
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
    setMutex(false);
  };

  const addBookmarkItemHandler = async (bookmark: GenericBookmark) => {
    if (mutex) return;
    setMutex(true);

    const URL = `${BOOKMARK_URL}/project/item/${bookmark.id}`;
    const res = await postHandler(URL, { itemID: project.id });

    if (res.statusCode === 201) {
      const bookmarkItem: ProjectBookmarkItem = res.data.bookmarkItem;
      const updatedBookmarks = bookmarks.map(projectBookmark => {
        if (projectBookmark.id === bookmark.id) {
          const updatedProjectItems = projectBookmark.projectItems
            ? [...projectBookmark.projectItems, bookmarkItem]
            : [bookmarkItem];
          return { ...projectBookmark, projectItems: updatedProjectItems };
        }
        return projectBookmark;
      });
      dispatch(setProjectBookmarks(updatedBookmarks));
      setShow(false);
      setBookmark(true, bookmarkItem.id, bookmarkItem.projectBookmarkID);
    }
    setMutex(false);
  };

  return (
    <BookmarkModal
      bookmarks={bookmarks}
      addBookmarkItemHandler={addBookmarkItemHandler}
      addBookmarkHandler={addBookmarkHandler}
      bookmarkTitle={bookmarkTitle}
      setBookmarkTitle={setBookmarkTitle}
      isDialogOpen={show}
      setIsDialogOpen={setShow}
    />
  );
};

export default BookmarkProject;
