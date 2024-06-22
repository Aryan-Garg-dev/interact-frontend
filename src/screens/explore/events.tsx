import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Event } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import Loader from '@/components/common/loader';
import EventCard from '@/components/organization/event_card';
import NoSearch from '@/components/fillers/search';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import { navbarOpenSelector } from '@/slices/feedSlice';
import OrderMenu from '@/components/common/order_menu';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState('trending');

  const open = useSelector(navbarOpenSelector);

  const fetchEvents = async (search: string | null, initialPage: number | null) => {
    const URL =
      search && search != ''
        ? `${EXPLORE_URL}/events?search=${search}&order=${order}`
        : order == 'recommended'
        ? `${EXPLORE_URL}/events/recommended?page=${initialPage ? initialPage : page}&limit=${10}`
        : `${EXPLORE_URL}/events?page=${initialPage ? initialPage : page}&limit=${10}&order=${order}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      if (search && search != '') {
        setEvents(res.data.events || []);
        setHasMore(false);
      } else {
        if ((!search && page == 1) || initialPage == 1) setEvents(res.data.events || []);
        else {
          const addedEvents = [...events, ...(res.data.events || [])];
          if (addedEvents.length === events.length) setHasMore(false);
          setEvents(addedEvents);
        }
        setPage(prev => prev + 1);
      }
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  useEffect(() => {
    setPage(1);
    setEvents([]);
    setHasMore(true);
    setLoading(true);
    fetchEvents(new URLSearchParams(window.location.search).get('search'), 1);
  }, [window.location.search, order]);
  return (
    <div className="w-full flex flex-col gap-6 pt-2">
      <OrderMenu orders={['trending', 'most_liked', 'most_viewed', 'latest']} current={order} setState={setOrder} />
      {loading ? (
        <Loader />
      ) : events.length > 0 ? (
        <InfiniteScroll
          className={`w-full ${
            open ? 'px-2 gap-4' : 'px-8 gap-8'
          } pb-12 flex flex-wrap justify-center transition-ease-out-500`}
          dataLength={events.length}
          next={() => fetchEvents(new URLSearchParams(window.location.search).get('search'), null)}
          hasMore={hasMore}
          loader={<Loader />}
        >
          {events.map(event => {
            return <EventCard key={event.id} event={event} size={96} />;
          })}
        </InfiniteScroll>
      ) : (
        <NoSearch />
      )}
    </div>
  );
};

export default Events;
