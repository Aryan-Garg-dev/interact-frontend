import postHandler from '@/handlers/post_handler';
import { setEventBookmarks, userSelector } from '@/slices/userSlice';
import { Event, EventBookmark, EventBookmarkItem, GenericBookmark } from '@/types';
import Toaster from '@/utils/toaster';
import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BOOKMARK_URL } from '@/config/routes';
import { SERVER_ERROR } from '@/config/errors';
import BookmarkModal from '@/components/common/bookmark_modal';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  event: Event;
  setBookmark: (isBookmarked: boolean, eventItemID: string, bookmarkID: string) => void;
}

const BookmarkEvent = ({ setShow, event, setBookmark }: Props) => {
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const [mutex, setMutex] = useState(false);
  const dispatch = useDispatch();

  const bookmarks = useSelector(userSelector).eventBookmarks || [];

  const addBookmarkHandler = async (el: FormEvent<HTMLFormElement>) => {
    el.preventDefault();
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Adding your Bookmark...');

    const URL = `${BOOKMARK_URL}/event`;
    const res = await postHandler(URL, { title: bookmarkTitle });

    if (res.statusCode === 201) {
      const bookmark: EventBookmark = res.data.bookmark;
      const updatedBookmarks = [...bookmarks, bookmark];
      dispatch(setEventBookmarks(updatedBookmarks));
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

    const URL = `${BOOKMARK_URL}/event/item/${bookmark.id}`;
    const res = await postHandler(URL, { itemID: event.id });

    if (res.statusCode === 201) {
      const bookmarkItem: EventBookmarkItem = res.data.bookmarkItem;
      const updatedBookmarks = bookmarks.map(eventBookmark => {
        if (eventBookmark.id === bookmark.id) {
          const updatedEventItems = eventBookmark.eventItems
            ? [...eventBookmark.eventItems, bookmarkItem]
            : [bookmarkItem];
          return { ...eventBookmark, eventItems: updatedEventItems };
        }
        return eventBookmark;
      });
      dispatch(setEventBookmarks(updatedBookmarks));
      setShow(false);
      setBookmark(true, bookmarkItem.id, bookmarkItem.eventBookmarkID);
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
      setShow={setShow}
    />
  );
};

export default BookmarkEvent;
