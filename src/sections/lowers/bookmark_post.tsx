import postHandler from '@/handlers/post_handler';
import { setPostBookmarks, userSelector } from '@/slices/userSlice';
import { Post, PostBookmark, PostBookmarkItem } from '@/types';
import Toaster from '@/utils/toaster';
import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BOOKMARK_URL } from '@/config/routes';
import { SERVER_ERROR } from '@/config/errors';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: Post;
  setBookmark: (isBookmarked: boolean, postItemID: string, bookmarkID: string) => void;
}

const BookmarkPost = ({ setShow, post, setBookmark }: Props) => {
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const [mutex, setMutex] = useState(false);
  const dispatch = useDispatch();

  const bookmarks = useSelector(userSelector).postBookmarks || [];

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

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

  const addBookmarkItemHandler = async (bookmark: PostBookmark) => {
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
    <>
      <div className="fixed top-32 w-1/3 max-lg:w-5/6 h-max flex flex-col items-center gap-8 right-1/2 translate-x-1/2 rounded-lg p-8 dark:text-white font-primary bg-white dark:bg-dark_primary_comp backdrop-blur-lg border-2 border-primary_btn  dark:border-dark_primary_btn animate-fade_third z-30">
        <div className="font-bold text-5xl text-gray-800 dark:text-white">Bookmarks</div>
        {bookmarks.length > 0 ? (
          <div className="w-full flex flex-wrap justify-center gap-2">
            {bookmarks.map((bookmark, index: number) => {
              return (
                <div
                  key={index}
                  className={`w-fit h-14 px-4 flex-center bg-primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active rounded-md cursor-pointer transition-ease-300`}
                  onClick={() => {
                    addBookmarkItemHandler(bookmark);
                  }}
                >
                  {bookmark.title}
                </div>
              );
            })}
          </div>
        ) : (
          <>No Post Bookmarks found, Create One Now!</>
        )}

        <form className="w-fit mx-auto" onSubmit={addBookmarkHandler}>
          <input
            className={`w-full h-14 px-4 ${
              bookmarkTitle == '' ? 'text-center' : ''
            } flex-center rounded-md bg-transparent border-[1px] border-primary_btn  dark:border-dark_primary_btn focus:outline-none`}
            value={bookmarkTitle}
            onChange={el => setBookmarkTitle(el.target.value)}
            placeholder="Add a new Bookmark"
          />
        </form>
      </div>
      <div
        onClick={() => setShow(false)}
        className=" bg-backdrop w-screen h-screen fixed top-0 right-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default BookmarkPost;
