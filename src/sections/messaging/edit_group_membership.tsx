import { MESSAGING_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import { GroupChat, GroupChatMembership } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useState } from 'react';
import Image from 'next/image';
import { X } from '@phosphor-icons/react';
import { SERVER_ERROR } from '@/config/errors';
import { GROUP_ADMIN, GROUP_MEMBER } from '@/config/constants';
import moment from 'moment';
import Link from 'next/link';

interface Props {
  membership: GroupChatMembership;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setChat: React.Dispatch<React.SetStateAction<GroupChat>>;
}

const EditMembership = ({ setShow, membership, setChat }: Props) => {
  const [mutex, setMutex] = useState(false);

  const handleChangeRole = async () => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Changing Role on the User');

    const URL = `${MESSAGING_URL}/group/role/${membership.chatID}`;

    const formData = {
      userID: membership.userID,
      role: membership.role == GROUP_ADMIN ? GROUP_MEMBER : GROUP_ADMIN,
    };

    const res = await postHandler(URL, formData);
    if (res.statusCode === 200) {
      setChat(prev => {
        return {
          ...prev,
          memberships: prev.memberships.map(m => {
            if (m.id == membership.id) {
              return { ...m, role: m.role == GROUP_ADMIN ? GROUP_MEMBER : GROUP_ADMIN };
            } else return m;
          }),
        };
      });
      setShow(false);
      Toaster.stopLoad(toaster, 'Role Changed of the User', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }

    setMutex(false);
  };

  const handleRemove = async () => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Remove Member from Group');

    const URL = `${MESSAGING_URL}/group/members/remove${membership.chatID}`;

    const formData = {
      userID: membership.userID,
    };

    const res = await postHandler(URL, formData);
    if (res.statusCode === 204) {
      setChat(prev => {
        return {
          ...prev,
          memberships: prev.memberships.filter(m => m.id != membership.id),
        };
      });
      setShow(false);
      Toaster.stopLoad(toaster, 'Member Removed from Group', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }

    setMutex(false);
  };

  return (
    <>
      <div className="absolute bottom-0 w-full backdrop-blur-2xl bg-[#ffe1fc22] flex flex-col gap-6 rounded-md p-10 max-lg:p-5 dark:text-white font-primary border-[1px] border-primary_btn  dark:border-dark_primary_btn right-1/2 translate-x-1/2 animate-fade_third z-50">
        <div className="w-full flex items-center gap-4">
          <Image
            crossOrigin="anonymous"
            width={50}
            height={50}
            alt={'User Pic'}
            src={`${USER_PROFILE_PIC_URL}/${membership.user.profilePic}`}
            className="rounded-full w-14 h-14 dark:bg-dark_primary_comp_hover"
          />
          <div className="grow flex items-center justify-between">
            <div className="flex flex-col">
              <div className="text-xl font-medium">{membership.user.name}</div>
              <div className="text-sm">Joined {moment(membership.createdAt).format('DD MMM YYYY')}</div>
            </div>
            <X onClick={() => setShow(false)} className="cursor-pointer" size={24} />
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex flex-col gap-1">
            <Link
              href={`/explore/user/${membership.user.username}`}
              className="w-full py-4 text-center dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active rounded-lg transition-ease-300"
            >
              Info
            </Link>
            <div
              onClick={handleChangeRole}
              className="w-full py-4 text-center dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active rounded-lg cursor-pointer transition-ease-300"
            >
              {membership.role == GROUP_MEMBER ? 'Make Group Admin' : 'Make Group Member'}
            </div>
          </div>
          <div
            onClick={handleRemove}
            className="w-full py-4 text-center dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active text-primary_danger rounded-lg cursor-pointer transition-ease-300"
          >
            Remove From Group
          </div>
        </div>
      </div>

      <div
        onClick={() => setShow(false)}
        className="bg-backdrop w-screen h-screen fixed top-0 left-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default EditMembership;
