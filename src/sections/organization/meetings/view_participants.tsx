import { ORG_SENIOR } from '@/config/constants';
import { SERVER_ERROR } from '@/config/errors';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import deleteHandler from '@/handlers/delete_handler';
import { currentOrgIDSelector } from '@/slices/orgSlice';
import { Meeting } from '@/types';
import checkOrgAccess from '@/utils/funcs/access';
import Toaster from '@/utils/toaster';
import ModalWrapper from '@/wrappers/modal';
import { PlusCircle, XCircle } from '@phosphor-icons/react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {
  meeting: Meeting;
  title: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedOnAddParticipants: React.Dispatch<React.SetStateAction<boolean>>;
  setMeeting: React.Dispatch<React.SetStateAction<Meeting>>;
}

const ParticipantsList = ({ meeting, title, setShow, setClickedOnAddParticipants, setMeeting }: Props) => {
  const currentOrgID = useSelector(currentOrgIDSelector);

  const handleRemove = async (userID: string) => {
    const toaster = Toaster.startLoad('Removing Participant...');
    const URL = `/org/${currentOrgID}/meetings/participants/${meeting.id}`;

    const res = await deleteHandler(URL, { userID });
    if (res.statusCode === 200) {
      setMeeting(prev => {
        return {
          ...prev,
          participants: prev.participants.filter(u => u.id != userID),
        };
      });
      Toaster.stopLoad(toaster, 'Participant Removed', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
  };

  return (
    <ModalWrapper setShow={setShow} width={'1/3'} top={'1/3'}>
      <div className="text-2xl flex-center gap-2 font-semibold">
        {title} ({meeting.participants.length}){' '}
        <PlusCircle onClick={() => setClickedOnAddParticipants(true)} className="cursor-pointer" weight="bold" />
      </div>
      <div className="w-full flex flex-col gap-2">
        {meeting.participants.map(user => (
          <div
            key={user.id}
            className={`w-full h-12 px-4 bg-white ${
              checkOrgAccess(ORG_SENIOR) && 'hover:bg-slate-100'
            } rounded-xl border-gray-400 flex items-center text-sm text-primary_black transition-ease-300`}
          >
            <div className="grow flex items-center gap-1">
              <Image
                crossOrigin="anonymous"
                width={50}
                height={50}
                alt={'User Pic'}
                src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
                placeholder="blur"
                blurDataURL={user.profilePicBlurHash || 'no-hash'}
                className="w-8 h-8 rounded-full z-[1]"
              />
              <div className="flex-center gap-2">
                <div className="font-medium text-lg">{user.name}</div>
                <div className="text-xs">@{user.username}</div>
              </div>
            </div>
            {checkOrgAccess(ORG_SENIOR) && <XCircle onClick={() => handleRemove(user.id)} className="cursor-pointer" />}
          </div>
        ))}
      </div>
    </ModalWrapper>
  );
};

export default ParticipantsList;
