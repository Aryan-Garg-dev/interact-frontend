import { Organization, OrganizationMembership, Project } from '@/types';
import React, { useState } from 'react';
import Image from 'next/image';
import { ORG_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import { useSelector } from 'react-redux';
import { Pen } from '@phosphor-icons/react';
import moment from 'moment';
import { ORG_MANAGER } from '@/config/constants';
import Toaster from '@/utils/toaster';
import deleteHandler from '@/handlers/delete_handler';
import ConfirmDelete from '@/components/common/confirm_delete';
import { SERVER_ERROR } from '@/config/errors';
import EditMember from '@/sections/organization/members/edit_member';
import checkOrgAccess from '@/utils/funcs/check_org_access';
import { currentOrgIDSelector, currentOrgSelector } from '@/slices/orgSlice';
import { userIDSelector } from '@/slices/userSlice';

interface Props {
  membership: OrganizationMembership;
  organization: Organization;
  setOrganization?: React.Dispatch<React.SetStateAction<Organization>>;
}

const MemberCard = ({ membership, organization, setOrganization }: Props) => {
  const [clickedOnEditCollaborator, setClickedOnEditCollaborator] = useState(false);
  const [clickedOnRemoveCollaborator, setClickedOnRemoveCollaborator] = useState(false);

  const currentOrg = useSelector(currentOrgSelector);

  const userID = useSelector(userIDSelector);

  const handleRemove = async () => {
    const toaster = Toaster.startLoad('Removing Collaborator...');

    const URL = `${ORG_URL}/${currentOrg.id}/membership/${membership.id}`;

    const res = await deleteHandler(URL);

    if (res.statusCode === 204) {
      if (setOrganization)
        setOrganization(prev => {
          return {
            ...prev,
            memberships: prev.memberships.filter(m => m.id != membership.id),
          };
        });
      setClickedOnRemoveCollaborator(false);
      Toaster.stopLoad(toaster, 'Collaborator Removed', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };
  return (
    <>
      {clickedOnEditCollaborator && (
        <EditMember
          membership={membership}
          organization={organization}
          setShow={setClickedOnEditCollaborator}
          setOrganization={setOrganization}
        />
      )}
      {clickedOnRemoveCollaborator && (
        <ConfirmDelete setShow={setClickedOnRemoveCollaborator} handleDelete={handleRemove} title="Confirm Remove?" />
      )}

      <div className="w-[49%] hover:scale-105 font-primary bg-white hover:shadow-xl dark:bg-transparent dark:text-white border-[1px] border-primary_btn dark:border-dark_primary_btn rounded-md flex justify-start gap-6 p-4 transition-ease-300">
        <Image
          crossOrigin="anonymous"
          width={50}
          height={50}
          alt={'User Pic'}
          src={`${USER_PROFILE_PIC_URL}/${membership.user.profilePic}`}
          className={'rounded-full w-16 h-16'}
        />
        <div className="grow flex flex-col gap-2 pt-1">
          <div className="w-full flex items-center justify-between">
            <div className="text-2xl font-semibold">{membership.user.name}</div>
            {checkOrgAccess(ORG_MANAGER) && userID != membership.userID ? (
              // Managers should not have edit access to other managers
              <Pen onClick={() => setClickedOnEditCollaborator(true)} className="cursor-pointer" size={24} />
            ) : (
              <></>
            )}
          </div>
          <div className="font-medium">{membership.title}</div>
          <div className="font-medium">{membership.role}</div>
          <div className="w-full flex items-center justify-between text-sm max-md:text-xs">
            <div className="text-gray-400">Joined {moment(membership.createdAt).format('DD MMM YYYY')}</div>
            {checkOrgAccess(ORG_MANAGER) && userID != membership.userID ? (
              <div onClick={() => setClickedOnRemoveCollaborator(true)} className="text-primary_danger cursor-pointer">
                Remove Member
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberCard;
