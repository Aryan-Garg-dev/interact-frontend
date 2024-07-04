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
  org?: boolean;
}

const OpeningCard = ({ opening, clickedOpening, setClickedOnOpening, setClickedOpening, org = false }: Props) => {
  return (
    <div
      onClick={() => {
        if (setClickedOpening) setClickedOpening(opening);
        if (setClickedOnOpening) setClickedOnOpening(true);
      }}
      className={`w-full ${
        opening.id == clickedOpening?.id ? 'bg-white' : 'hover:bg-gray-100'
      } font-primary border-[1px] border-primary_btn rounded-lg p-3 flex items-center gap-3 transition-ease-300 cursor-pointer animate-fade_third`}
    >
      {org ? (
        <Image
          crossOrigin="anonymous"
          width={200}
          height={200}
          alt={'User Pic'}
          src={`${USER_PROFILE_PIC_URL}/${opening.organization?.user?.profilePic}`}
          className={'w-[110px] h-[110px] max-lg:w-[90px] max-lg:h-[90px] rounded-lg object-cover'}
        />
      ) : (
        <Image
          crossOrigin="anonymous"
          width={200}
          height={200}
          alt={'User Pic'}
          src={`${PROJECT_PIC_URL}/${opening.project?.coverPic}`}
          className={'w-[110px] h-[110px] max-lg:w-[90px] max-lg:h-[90px] rounded-lg object-cover'}
          placeholder="blur"
          blurDataURL={opening.project?.blurHash || 'no-hash'}
        />
      )}

      <div className="w-[calc(100%-140px)] flex flex-col gap-2">
        <div className="w-5/6 flex flex-col gap-1">
          <div className="font-bold text-2xl max-lg:text-lg text-gradient line-clamp-1">{opening.title}</div>
          <div className="w-fit font-medium flex-center text-sm line-clamp-1">
            @
            {org ? (
              <span className="w-fit flex-center gap-1">
                {opening.organization?.title} <Buildings />
              </span>
            ) : (
              opening.project?.title
            )}
          </div>
        </div>
        {opening.tags.length > 0 && <Tags tags={opening.tags} />}
        <div className="text-xs opacity-60 max-lg:text-xs">{moment(opening.createdAt).fromNow()}</div>
      </div>
    </div>
  );
};

export default OpeningCard;
