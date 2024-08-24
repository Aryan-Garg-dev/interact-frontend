import { Opening } from '@/types';
import React from 'react';
import Image from 'next/image';
import { PROJECT_PIC_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import moment from 'moment';
import { Buildings } from '@phosphor-icons/react';
import Tags from '../common/tags';

interface Props {
  opening: Opening;
  clickedOpening?: Opening;
  setClickedOnOpening?: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedOpening?: React.Dispatch<React.SetStateAction<Opening>>;
  short?: boolean;
}

const OpeningCard = ({ opening, clickedOpening, setClickedOnOpening, setClickedOpening, short = false }: Props) => {
  return (
    <div
      onClick={() => {
        if (setClickedOpening) setClickedOpening(opening);
        if (setClickedOnOpening) setClickedOnOpening(true);
      }}
      className={`w-full ${
        opening.id == clickedOpening?.id ? 'bg-white' : 'hover:bg-gray-100'
      } font-primary border-[1px] border-primary_btn rounded-lg flex items-center gap-3 ${
        short ? 'p-2' : 'p-3'
      } transition-ease-300 cursor-pointer animate-fade_third`}
    >
      {opening.organizationID && opening.organization ? (
        <Image
          crossOrigin="anonymous"
          width={200}
          height={200}
          alt={'User Pic'}
          src={`${USER_PROFILE_PIC_URL}/${opening.organization?.user?.profilePic}`}
          placeholder="blur"
          blurDataURL={opening.organization?.user?.profilePicBlurHash || 'no-hash'}
          className={`${
            short ? 'w-[90px] h-[90px]' : 'w-[110px] h-[110px]'
          } max-lg:w-[90px] max-lg:h-[90px] rounded-full object-cover`}
        />
      ) : (
        <Image
          crossOrigin="anonymous"
          width={200}
          height={200}
          alt={'Project Pic'}
          src={`${PROJECT_PIC_URL}/${opening.project?.coverPic}`}
          className={`${
            short ? 'w-[90px] h-[90px]' : 'w-[110px] h-[110px]'
          } max-lg:w-[90px] max-lg:h-[90px] rounded-lg object-cover`}
          placeholder="blur"
          blurDataURL={opening.project?.blurHash || 'no-hash'}
        />
      )}

      <div className={`${short ? 'w-[calc(100%-90px)]' : 'w-[calc(100%-140px)]'} flex flex-col gap-2`}>
        <div className="w-5/6 flex flex-col gap-1">
          <div className={`w-full font-semibold ${short ? 'text-xl' : 'text-2xl'} max-lg:text-lg line-clamp-1`}>
            {opening.title}
          </div>
          <div className="w-fit font-medium flex-center gap-1 text-sm line-clamp-1">
            @
            {opening.organizationID && opening.organization ? (
              <span className="w-fit flex-center gap-1">
                {opening.organization?.title} <Buildings />
              </span>
            ) : (
              <span className="line-clamp-1">{opening.project?.title}</span>
            )}
          </div>
        </div>
        {opening.tags.length > 0 && <Tags tags={opening.tags} limit={short ? 15 : 20} />}
        {!short && <div className="text-xs opacity-60 max-lg:text-xs">{moment(opening.createdAt).fromNow()}</div>}
      </div>
    </div>
  );
};

export default OpeningCard;
