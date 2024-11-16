import postHandler from '@/handlers/post_handler';
import { setPostBookmarks, userSelector } from '@/slices/userSlice';
import { GenericBookmark, Post, PostBookmark, PostBookmarkItem } from '@/types';
import Toaster from '@/utils/toaster';
import React, { FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BOOKMARK_URL } from '@/config/routes';
import { SERVER_ERROR } from '@/config/errors';
import BookmarkModal from '@/components/common/bookmark_modal';

interface Props {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: Post;
  setBookmark: (isBookmarked: boolean, postItemID: string, bookmarkID: string) => void;
}

const BookmarkPost = ({ show, setShow, post, setBookmark }: Props) => {
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const [mutex, setMutex] = useState(false);
  const dispatch = useDispatch();

  const bookmarks = useSelector(userSelector).postBookmarks || [];

  const addBookmarkHandler = async (el: FormEvent<HTMLFormElement>) => {
    el.preventDefault();
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Adding your Bookmark...');

    const URL = `${BOOKMARK_URL}/post`;
    const res = await postHandler(URL, { title: bookmarkTitle });

    if (res.statusCode === 201) {
      const bookmark: PostBookmark = res.data.bookmark;
      const updatedBookmarks = [...bookmarks, bookmark];
      dispatch(setPostBookmarks(updatedBookmarks));
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

    const URL = `${BOOKMARK_URL}/post/item/${bookmark.id}`;
    const res = await postHandler(URL, { itemID: post.id });

    if (res.statusCode === 201) {
      const bookmarkItem: PostBookmarkItem = res.data.bookmarkItem;
      const updatedBookmarks = bookmarks.map(postBookmark => {
        if (postBookmark.id === bookmark.id) {
          const updatedPostItems = postBookmark.postItems ? [...postBookmark.postItems, bookmarkItem] : [bookmarkItem];
          return { ...postBookmark, postItems: updatedPostItems };
        }
        return postBookmark;
      });
      dispatch(setPostBookmarks(updatedBookmarks));
      setShow(false);
      setBookmark(true, bookmarkItem.id, bookmarkItem.postBookmarkID);
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

export default BookmarkPost;
