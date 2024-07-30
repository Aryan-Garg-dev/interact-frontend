import { PROJECT_PIC_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import moment from 'moment';
import Image from 'next/image';
import React from 'react';
import Share from './share';
import Tags from '@/components/common/tags';
import { Opening } from '@/types';

interface Props {
  opening: Opening;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  org?: boolean;
}

const ShareOpening = ({ opening, setShow, org = false }: Props) => {
  return (
    <Share
      itemID={opening.id}
      itemType="opening"
      setShow={setShow}
      clipboardURL={`explore?oid=${opening.id}&action=external`}
      item={
        <div className="w-full max-md:w-full font-primary dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg p-4 flex flex-col items-center justify-center gap-4 max-lg:gap-4 transition-ease-300 cursor-default">
          {org ? (
            <Image
              crossOrigin="anonymous"
              width={100}
              height={100}
              alt={'User Pic'}
              src={`${USER_PROFILE_PIC_URL}/${opening.organization?.user.profilePic}`}
              className={'w-[180px] h-[180px] max-lg:w-[120px] max-lg:h-[120px] rounded-lg object-cover'}
            />
          ) : (
            <Image
              crossOrigin="anonymous"
              width={100}
              height={100}
              alt={'User Pic'}
              src={`${PROJECT_PIC_URL}/${opening.project?.coverPic}`}
              className={'w-[180px] h-[180px] max-lg:w-[120px] max-lg:h-[120px] rounded-lg object-cover'}
              placeholder="blur"
              blurDataURL={opening.project?.blurHash || 'no-hash'}
            />
          )}

          <div className="w-full flex flex-col gap-4 max-lg:gap-2 px-8">
            <div className="w-full flex flex-col items-center gap-1 text-center">
              <div className="font-bold line-clamp-2 text-2xl text-gradient">{opening.title}</div>
              <div className="text-sm">@{org ? opening.organization?.title : opening.project?.title}</div>
              <div className="text-xs font-thin">{moment(opening.createdAt).fromNow()}</div>
            </div>

            <Tags tags={opening.tags} center={true} limit={30} />
          </div>
        </div>
      }
    />
  );
};

export default ShareOpening;
