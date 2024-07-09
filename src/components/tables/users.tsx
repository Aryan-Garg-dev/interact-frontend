import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { User } from '@/types';
import Image from 'next/image';
import React from 'react';

interface Props {
  users: User[];
}

const ParticipantsTable = ({ users }: Props) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {/* <div className="w-full h-12 bg-white rounded-xl border-gray-400 flex font-semibold text-primary_black">
        <div className="w-[30%] flex-center">Name</div>
        <div className="w-[30%] flex-center"></div>
        <div className="w-[30%] flex-center">Ended At</div>
        <div className="w-[10%] flex-center"></div>
      </div> */}
      {users.map(user => (
        <div
          key={user.id}
          className="w-full h-12 bg-white rounded-xl border-gray-400 flex text-sm text-primary_black transition-ease-300"
        >
          <div className="w-[30%] flex items-center gap-1">
            <Image
              crossOrigin="anonymous"
              width={50}
              height={50}
              alt={'User Pic'}
              src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
              className="w-8 h-8 rounded-full z-[1]"
            />
            <div className="font-medium">{user.name}</div>
          </div>
          <div className="w-[30%] flex-center">{}</div>
          <div className="w-[30%] flex-center">{}</div>
          <div className="w-[10%] flex-center"></div>
        </div>
      ))}
    </div>
  );
};

export default ParticipantsTable;
