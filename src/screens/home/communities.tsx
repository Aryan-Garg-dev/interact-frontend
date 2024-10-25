import getHandler from '@/handlers/get_handler';
import { Community } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EXPLORE_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import { SERVER_ERROR } from '@/config/errors';
import Loader from '@/components/common/loader';
import organisations from '@/pages/organisations';

const Communities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchCommunities = async () => {
    setLoading(false);

    const URL = `${EXPLORE_URL}/communities?page=${page}&limit=${10}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      const addedCommunity: Community[] = [...communities, ...(res.data.communities || [])];
      if (addedCommunity.length === history.length) setHasMore(false);
      setCommunities(addedCommunity);
      setPage(prev => prev + 1);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  return (
    <div className="w-full flex flex-col gap-2">
      {loading && page == 1 ? (
        <Loader />
      ) : (
        <InfiniteScroll
          dataLength={communities.length}
          next={fetchCommunities}
          hasMore={hasMore}
          loader={<Loader />}
          className="flex flex-col gap-1"
        >
          <div className="w-full flex flex-col gap-2">
            {communities.map(community => (
              <div key={community.id}></div>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Communities;
