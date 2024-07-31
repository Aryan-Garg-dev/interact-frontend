import React from 'react';
import Image from 'next/image';
import { Event } from '@/types';
import Link from 'next/link';
import { EVENT_PIC_URL } from '@/config/routes';
import { Eye } from '@phosphor-icons/react';
import moment from 'moment';

interface Props {
  event: Event;
}

const EventCard = ({ event }: Props) => {
  return (
    <Link href={`/explore/event/${event.id}`} target="_blank" className="w-full rounded-xl animate-fade_third">
      <div className="w-full relative group">
        <div className="w-fit flex-center gap-1 top-2 right-2 absolute bg-white text-gray-500 text-xxs px-2 rounded-lg">
          <Eye size={12} /> <div>{event.noImpressions}</div>
        </div>
        <Image
          width={200}
          height={200}
          src={`${EVENT_PIC_URL}/${event.coverPic}`}
          alt=""
          className="w-full object-cover rounded-t-xl"
          placeholder="blur"
          blurDataURL={event.blurHash || 'no-hash'}
        />
        <div className="absolute bottom-2 right-2 bg-white text-gray-500 text-xxs px-2 py-1 rounded-lg">
          {event.organization.title}
        </div>
      </div>
      <div className="w-full h-20 bg-white shadow-sm rounded-b-xl flex p-4">
        <div className="w-1/6 flex items-start justify-start">
          <div className="w-fit flex flex-col items-end">
            <div className="w-fit text-xxs uppercase transition-ease-out-500">
              {moment(event.startTime).format('MMM')}
            </div>
            <div className="w-fit text-2xl font-semibold transition-ease-out-500">
              {moment(event.startTime).format('DD')}
            </div>
          </div>
        </div>
        <div className="w-5/6 h-16 flex flex-col">
          <div className="font-medium text-lg line-clamp-1">{event.title}</div>
          <div className="text-xs text-gray-500 line-clamp-2">{event.tagline}</div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
