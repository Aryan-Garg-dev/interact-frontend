import ConfirmDelete from '@/components/common/confirm_delete';
import { SERVER_ERROR } from '@/config/errors';
import { INVITATION_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import deleteHandler from '@/handlers/delete_handler';
import { currentOrgSelector } from '@/slices/orgSlice';
import { userSelector } from '@/slices/userSlice';
import { Invitation, Project } from '@/types';
import { initialInvitation } from '@/types/initials';
import getInvitationStatus, { getInvitationStatusColor } from '@/utils/funcs/invitation';
import Toaster from '@/utils/toaster';
import { Trash } from '@phosphor-icons/react';
import moment from 'moment';
import Image from 'next/image';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {
  invitations: Invitation[];
  project: Project;
  setProject?: React.Dispatch<React.SetStateAction<Project>>;
  org?: boolean;
}

const InvitationsTable = ({ invitations, project, setProject, org }: Props) => {
  const [clickedInvitation, setClickedInvitation] = useState(initialInvitation);
  const [clickedOnWithdraw, setClickedOnWithdraw] = useState(false);

  const user = useSelector(userSelector);

  const currentOrgID = useSelector(currentOrgSelector).id;

  //TODO make org managers be able to do this
  const handleWithdraw = async (invitation: Invitation) => {
    const toaster = Toaster.startLoad('Withdrawing Invitation...');

    const URL = `${INVITATION_URL}/withdraw/${invitation.id}`;

    const res = await deleteHandler(URL);

    if (res.statusCode === 204) {
      if (setProject)
        setProject(prev => {
          return {
            ...prev,
            invitations: prev.invitations.filter(inv => inv.id != invitation.id),
          };
        });
      setClickedInvitation(initialInvitation);
      setClickedOnWithdraw(false);
      Toaster.stopLoad(toaster, 'Invitation Withdrawn', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };
  return (
    <div className="w-full flex flex-col gap-2">
      {clickedOnWithdraw && (
        <ConfirmDelete
          setShow={setClickedOnWithdraw}
          handleDelete={() => handleWithdraw(clickedInvitation)}
          title="Confirm Withdraw?"
        />
      )}

      <div className="w-full h-12 bg-white rounded-xl border-gray-400 flex font-semibold max-md:text-sm text-primary_black">
        <div className="w-[30%] max-md:w-[35%] flex-center">Name</div>
        <div className="w-[15%] max-md:w-[20%] flex-center">Title</div>
        <div className="w-[10%] max-md:w-[15%] flex-center">Status</div>
        <div className="w-[25%] max-md:hidden flex-center">Invited By</div>
        <div className="w-[15%] max-md:w-[20%] flex-center">Invited On</div>
        <div className="w-[5%] max-md:w-[10%] flex-center"></div>
      </div>
      {invitations.map(invitation => (
        <div
          key={invitation.user.id}
          className="w-full h-12 bg-white rounded-xl border-gray-400 flex text-sm text-primary_black transition-ease-300"
        >
          <div className="w-[30%] max-md:w-[35%] flex-center gap-1 px-4">
            <Image
              crossOrigin="anonymous"
              width={50}
              height={50}
              alt={'User Pic'}
              src={`${USER_PROFILE_PIC_URL}/${invitation.user.profilePic}`}
              placeholder="blur"
              blurDataURL={invitation.user.profilePicBlurHash || 'no-hash'}
              className="w-8 h-8 rounded-full z-[1]"
            />
            <div className="w-[calc(100%-32px)] flex max-md:flex-col items-center flex-wrap gap-1 max-md:gap-0">
              <div className="max-md:w-full font-medium text-base max-md:text-sm line-clamp-1">
                {invitation.user.name}
              </div>
              <div className="max-md:w-full text-xs max-md:text-xxs line-clamp-1">@{invitation.user.username}</div>
            </div>
          </div>
          <div className="w-[15%] max-md:w-[20%] flex-center">{invitation.title}</div>
          <div className="w-[10%] max-md:w-[15%] flex-center">
            <div
              className="w-fit px-3 max-md:px-2 py-1 text-xs max-md:text-xxs font-medium rounded-full"
              style={{ backgroundColor: getInvitationStatusColor(invitation.status) }}
            >
              {getInvitationStatus(invitation.status)}
            </div>
          </div>
          <div className="w-[25%] max-md:hidden flex-center gap-1 px-4">
            <Image
              crossOrigin="anonymous"
              width={50}
              height={50}
              alt={'User Pic'}
              src={`${USER_PROFILE_PIC_URL}/${invitation.sender.profilePic}`}
              placeholder="blur"
              blurDataURL={invitation.sender.profilePicBlurHash || 'no-hash'}
              className="w-6 h-6 rounded-full z-[1]"
            />
            <div className="w-fit flex items-center flex-wrap gap-1">
              <div className="font-medium text-sm line-clamp-1">{invitation.sender.name}</div>
              {/* <div className="text-xxs">@{invitation.sender.username}</div> */}
            </div>
          </div>
          <div className="w-[15%] max-md:w-[20%] flex-center max-md:text-xxs">
            {moment(invitation.createdAt).format('DD MMMM, YYYY')}
          </div>
          <div className="w-[5%] max-md:w-[10%] flex-center">
            {invitation.status == 0 && (project.userID == user.id || user.managerProjects.includes(project.id)) && (
              <Trash
                onClick={() => {
                  setClickedInvitation(invitation);
                  setClickedOnWithdraw(true);
                }}
                className="cursor-pointer"
                size={20}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvitationsTable;
