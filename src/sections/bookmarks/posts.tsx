import PostComponent from '@/components/home/post';
import { PostBookmark } from '@/types';
import { ArrowArcLeft } from '@phosphor-icons/react';
import React from 'react';

interface Props {
  bookmark: PostBookmark;
  setClick: React.Dispatch<React.SetStateAction<boolean>>;
  fetchBookmarks?: () => void;
}

const Posts = ({ bookmark, setClick, fetchBookmarks }: Props) => {
  return (
    <div className="w-[50vw] max-lg:w-[85vw] max-md:w-[90vw] mx-auto flex flex-col gap-2 font-primary dark:text-white pt-8 max-lg:pt-4">
      <div className="flex items-center gap-2">
        <ArrowArcLeft
          onClick={() => {
            if (fetchBookmarks) fetchBookmarks();
            setClick(false);
          }}
          className="cursor-pointer"
          size={32}
        />
        <div className="font-medium text-xl cursor-default">{bookmark.title}</div>
      </div>
      {bookmark.postItems.length === 0 ? (
        <div className="mx-auto pt-4">No Items :)</div>
      ) : (
        <div className="w-full flex flex-col gap-2">
          {bookmark.postItems.map(postItem => {
            return <PostComponent key={postItem.id} post={postItem.post} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Posts;
