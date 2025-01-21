import React from 'react';
import type { Event } from '@/types';
import Image from 'next/image';
import { COMMUNITY_COVER_PIC_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import UserHoverCard from './user_hover_card';

interface Props {
  event: Event;
}

const getDurationInHours = (startTime: Date, endTime: Date) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end.getTime() - start.getTime();
  const durationHours = durationMs / (1000 * 60 * 60); // Convert milliseconds to hours
  return `${durationHours} hours`;
};

const EventCardNew = ({ event }: Props) => {
  const startDate = event.hackathon?.startTime ? new Date(event.hackathon.startTime) : null;
  const formattedMonth = startDate ? new Intl.DateTimeFormat('en-US', { month: 'short' }).format(startDate) : 'N/A';
  const formattedDay = startDate ? startDate.getDate() : 'N/A';

  const getPrizeAmount = () => {
    if (event.hackathon && event.hackathon.prizes) {
      return String(event.hackathon.prizes[0].amount);
    }
    return 'N/A';
  };

  const getTeamSize = () => {
    if (event.hackathon) {
      return `${event.hackathon.minTeamSize || 'N/A'}-${event.hackathon.maxTeamSize || 'N/A'}`;
    }
    return 'N/A';
  };

  return (
    <div className="relative w-full max-w-md bg-white rounded-3xl p-6 hover:shadow-xl transition-ease-300 m-2">
      <div className="relative">
        <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-6">
          {event.hackathon?.coverPic ? (
            <Image
              src={`${COMMUNITY_COVER_PIC_URL}/${event.hackathon?.coverPic}`}
              alt="Event Cover"
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <Image
              src={`${COMMUNITY_COVER_PIC_URL}/${event.coverPic}`}
              alt="Event Cover"
              layout="fill"
              objectFit="cover"
              className="rounded-2xl"
            />
          )}
        </div>
        <div className="absolute bottom-[-10px] -left-4">
          {event.hackathonID ? (
            <UserHoverCard
              trigger={
                <div className="bg-white rounded-full p-3">
                  <div className={`relative  w-12 h-12 rounded-full flex flex-col items-center justify-center`}>
                    <Image
                      crossOrigin="anonymous"
                      width={100}
                      height={100}
                      alt={'User Pic'}
                      src={`${USER_PROFILE_PIC_URL}/${event.organization.user.profilePic}`}
                      className="w-10 h-10 rounded-full mt-1"
                    />
                  </div>
                </div>
              }
              user={event.organization.user}
            />
          ) : (
            <UserHoverCard
              trigger={
                <div className="bg-white rounded-full p-3">
                  <div className={`relative w-12 h-12 rounded-full flex flex-col items-center justify-center`}>
                    <Image
                      crossOrigin="anonymous"
                      width={100}
                      height={100}
                      alt={'User Pic'}
                      src={`${USER_PROFILE_PIC_URL}/${event.organization.user.profilePic}`}
                      className="w-10 h-10 rounded-full mt-1"
                    />
                  </div>
                </div>
              }
              user={event.organization.user}
            />
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
          <p className="text-gray-600 text-lg">{event.tagline}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <p className="text-gray-500 mb-1">{event.hackathonID ? 'Prize' : 'Duration'}</p>
            <p className="text-center text-3xl font-bold">
              {event.hackathonID ? getPrizeAmount() : getDurationInHours(event.startTime, event.endTime)}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-gray-500 mb-1">{event.hackathonID ? 'Team' : 'Location'}</p>
            <p className="text-3xl font-bold">{event.hackathonID ? getTeamSize() : event.location}</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-500 mb-1">Date</p>
            <p className="text-3xl font-bold">{formattedMonth}</p>
            <p className="text-3xl font-bold">{formattedDay}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCardNew;
