import postHandler from '@/handlers/post_handler';
import { setOpeningBookmarks, userSelector } from '@/slices/userSlice';
import { GenericBookmark, Opening, OpeningBookmark, OpeningBookmarkItem } from '@/types';
import Toaster from '@/utils/toaster';
import React, { FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BOOKMARK_URL } from '@/config/routes';
import { SERVER_ERROR } from '@/config/errors';
import BookmarkModal from '@/components/common/bookmark_modal';

interface Props {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  opening: Opening;
  setBookmark: (isBookmarked: boolean, openingItemID: string, bookmarkID: string) => void;
}

const BookmarkOpening = ({ show, setShow, opening, setBookmark }: Props) => {
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const [mutex, setMutex] = useState(false);
  const dispatch = useDispatch();

  const bookmarks = useSelector(userSelector).openingBookmarks || [];

  const addBookmarkHandler = async (el: FormEvent<HTMLFormElement>) => {
    el.preventDefault();
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Adding your Bookmark...');

    const URL = `${BOOKMARK_URL}/opening`;
    const res = await postHandler(URL, { title: bookmarkTitle });

    if (res.statusCode === 201) {
      const bookmark: OpeningBookmark = res.data.bookmark;
      const updatedBookmarks = [...bookmarks, bookmark];
      dispatch(setOpeningBookmarks(updatedBookmarks));
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

    const URL = `${BOOKMARK_URL}/opening/item/${bookmark.id}`;
    const res = await postHandler(URL, { itemID: opening.id });

    if (res.statusCode === 201) {
      const bookmarkItem: OpeningBookmarkItem = res.data.bookmarkItem;
      const updatedBookmarks = bookmarks.map(openingBookmark => {
        if (openingBookmark.id === bookmark.id) {
          const updatedOpeningItems = openingBookmark.openingItems
            ? [...openingBookmark.openingItems, bookmarkItem]
            : [bookmarkItem];
          return { ...openingBookmark, openingItems: updatedOpeningItems };
        }
        return openingBookmark;
      });
      dispatch(setOpeningBookmarks(updatedBookmarks));
      setShow(false);
      setBookmark(true, bookmarkItem.id, bookmarkItem.openingBookmarkID);
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

export default BookmarkOpening;
