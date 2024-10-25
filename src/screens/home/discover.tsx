import PostComponent from '@/components/home/post';
import getHandler from '@/handlers/get_handler';
import { Post } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import RePostComponent from '@/components/home/repost';
import { EXPLORE_URL } from '@/config/routes';
import { SERVER_ERROR } from '@/config/errors';
import PostsLoader from '@/components/loaders/posts';

const Discover = () => {
  const [feed, setFeed] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const getFeed = () => {
    const URL = `${EXPLORE_URL}/posts/trending?page=${page}&limit=${5}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const addedFeed = [...feed, ...res.data.posts];
          if (addedFeed.length === feed.length) setHasMore(false);
          setFeed(addedFeed);
          setPage(prev => prev + 1);
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else {
            Toaster.error(SERVER_ERROR, 'error_toaster');
          }
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div className="w-full">
      {loading ? (
        <PostsLoader />
      ) : feed.length === 0 ? (
        // <NoFeed />
        <></>
      ) : (
        <InfiniteScroll
          className="w-full"
          dataLength={feed.length}
          next={getFeed}
          hasMore={hasMore}
          loader={<PostsLoader />}
        >
          {feed.map(post => {
            // if (post.rePost) return <RePostComponent key={post.id} post={post} />;
            // else
            return <PostComponent key={post.id} post={post} />;
          })}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Discover;
