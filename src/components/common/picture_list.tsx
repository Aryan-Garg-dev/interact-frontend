import { User } from '@/types';
import React from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';

interface Props {
  users: User[];
  size?: number;
  gap?: number;
}

const PictureList = ({ users, size = 4, gap = 1 }: Props) => {
  const variations = [
    'left-0',
    'left-1',
    'left-2',
    'left-3',
    'left-4',
    'left-5',
    'left-6',
    'left-7',
    'left-8',
    'left-9',
    'left-10',
    'w-4',
    'w-6',
    'w-8',
    'w-9',
    'w-10',
    'w-11',
    'w-12',
    'w-13',
    'w-14',
    'w-15',
    'w-16',
    'w-17',
    'w-18',
    'w-19',
    'w-20',
    'h-4',
    'h-6',
    'h-8',
    'h-12',
    'h-18',
  ];
  return users.length > 0 ? (
    <div className="flex gap-1">
      <div
        className={`w-${
          (gap - 1) *
            users.filter((_, index) => {
              return index >= 0 && index < 3;
            }).length +
          size -
          1
        } h-${size} relative mr-1`}
      >
        {users
          .filter((u, index) => {
            return index >= 0 && index < 3;
          })
          .map((u, index) => {
            return (
              <Image
                key={index}
                crossOrigin="anonymous"
                width={50}
                height={50}
                alt={'User Pic'}
                src={`${USER_PROFILE_PIC_URL}/${u.profilePic}`}
                className={`w-${size} h-${size} rounded-full cursor-default shadow-md absolute top-0 left-${
                  index * gap
                }`}
              />
            );
          })}
      </div>
      {users.length > 3 && (
        <>
          <div>+</div>
          <div>
            {users.length - 3} other{users.length - 3 != 1 ? 's' : ''}
          </div>
        </>
      )}
    </div>
  ) : (
    <></>
  );
};

export default PictureList;
