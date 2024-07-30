import CopyClipboardButton from '@/components/buttons/copy_clipboard_btn';
import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import { MESSAGING_URL, PROJECT_PIC_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import postHandler from '@/handlers/post_handler';
import { Chat, Project } from '@/types';
import { getMessagingUser } from '@/utils/funcs/messaging';
import Toaster from '@/utils/toaster';
import { X } from '@phosphor-icons/react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Share from './share';

interface Props {
  project: Project;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShareProject = ({ project, setShow }: Props) => {
  return (
    <Share
      itemID={project.id}
      itemType="project"
      setShow={setShow}
      clipboardURL={`explore?pid=${project.slug}?action=external`}
      item={
        <div className="w-full font-primary  border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg p-4 flex flex-col items-center justify-center gap-4 max-lg:gap-4 transition-ease-300 cursor-default">
          <Image
            crossOrigin="anonymous"
            width={100}
            height={100}
            alt={'User Pic'}
            src={`${PROJECT_PIC_URL}/${project.coverPic}`}
            className={'w-[220px] h-[220px] max-lg:w-[120px] max-lg:h-[120px] rounded-lg object-cover'}
            placeholder="blur"
            blurDataURL={project.blurHash || 'no-hash'}
          />

          <div className="w-full flex flex-col text-center items-center gap-1">
            <div className="font-bold line-clamp-2 text-center text-xl text-gradient">{project.title}</div>
            <div className="text-xs font-medium">{project.tagline}</div>
          </div>
        </div>
      }
    />
  );
};

export default ShareProject;
