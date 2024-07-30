import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { Post } from '@/types';
import renderContentWithLinks from '@/utils/funcs/render_content_with_links';
import moment from 'moment';
import Image from 'next/image';
import React from 'react';
import Share from './share';

interface Props {
  post: Post;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const SharePost = ({ post, setShow }: Props) => {
  return (
    <Share
      itemID={post.id}
      itemType="post"
      setShow={setShow}
      clipboardURL={`/explore/post/${post.id}`}
      item={
        <div className="w-full h-fit font-primary flex gap-1 border-primary_btn dark:border-dark_primary_btn border-[1px] dark:text-white rounded-xl p-2 max-md:px-4 max-md:py-4">
          <div className="h-full">
            <div className="rounded-full">
              <Image
                crossOrigin="anonymous"
                width={50}
                height={50}
                alt={'User Pic'}
                src={`${USER_PROFILE_PIC_URL}/${post.user.profilePic}`}
                className={'rounded-full w-8 h-8'}
              />
            </div>
          </div>
          <div className="w-[calc(100%-32px)] flex flex-col gap-1">
            <div className="w-full h-fit flex justify-between items-center">
              <div className="font-medium">{post.user.username}</div>
              <div className="flex gap-2 font-light text-xxs">{moment(post.postedAt).fromNow()}</div>
            </div>
            <div className="w-full text-xs  whitespace-pre-wrap mb-2 line-clamp-8">
              {renderContentWithLinks(post.content, post.taggedUsers)}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default SharePost;
