import ConfirmDelete from '@/components/common/confirm_delete';
import { ORG_MANAGER, PROJECT_MANAGER } from '@/config/constants';
import { SERVER_ERROR } from '@/config/errors';
import { MEMBERSHIP_URL, ORG_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import deleteHandler from '@/handlers/delete_handler';
import EditCollaborator from '@/sections/workspace/manage_project/edit_collaborator';
import { currentOrgSelector } from '@/slices/orgSlice';
import { userSelector } from '@/slices/userSlice';
import { Membership, Project, User } from '@/types';
import { initialMembership } from '@/types/initials';
import checkOrgAccess from '@/utils/funcs/check_org_access';
import { getRoleColor } from '@/utils/funcs/membership';
import Toaster from '@/utils/toaster';
import { Pen, Trash } from '@phosphor-icons/react';
import moment from 'moment';
import Image from 'next/image';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {
  memberships: Membership[];
  project: Project;
  setProject?: React.Dispatch<React.SetStateAction<Project>>;
  org?: boolean;
}

const CollaboratorsTable = ({ memberships, project, setProject, org }: Props) => {
  const [clickedMembership, setClickedMembership] = useState(initialMembership);
  const [clickedOnEditCollaborator, setClickedOnEditCollaborator] = useState(false);
  const [clickedOnRemoveCollaborator, setClickedOnRemoveCollaborator] = useState(false);

  const user = useSelector(userSelector);

  const currentOrgID = useSelector(currentOrgSelector).id;

  const handleRemove = async (membership: Membership) => {
    const toaster = Toaster.startLoad('Removing Collaborator...');

    const URL = org
      ? `${ORG_URL}/${currentOrgID}/project/membership/${membership.id}`
      : `${MEMBERSHIP_URL}/${membership.id}`;

    const res = await deleteHandler(URL);

    if (res.statusCode === 204) {
      if (setProject)
        setProject(prev => {
          return {
            ...prev,
            memberships: prev.memberships.filter(m => m.id != membership.id),
          };
        });
      setClickedOnRemoveCollaborator(false);
      setClickedMembership(initialMembership);
      Toaster.stopLoad(toaster, 'Collaborator Removed', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };
  return (
    <div className="w-full flex flex-col gap-2">
      {clickedOnEditCollaborator && (
        <EditCollaborator
          membership={clickedMembership}
          project={project}
          setShow={setClickedOnEditCollaborator}
          setProject={setProject}
          org={org}
        />
      )}
      {clickedOnRemoveCollaborator && (
        <ConfirmDelete
          setShow={setClickedOnRemoveCollaborator}
          handleDelete={() => handleRemove(clickedMembership)}
          title="Confirm Remove?"
        />
      )}
      <div className="w-full h-12 bg-white rounded-xl border-gray-400 flex font-semibold text-primary_black">
        <div className="w-[35%] flex-center">Name</div>
        <div className="w-[20%] flex-center">Title</div>
        <div className="w-[10%] flex-center">Role</div>
        <div className="w-[20%] flex-center">Joined At</div>
        <div className="w-[15%] flex-center">Action</div>
      </div>
      {memberships.map(membership => (
        <div
          key={membership.user.id}
          className="w-full h-12 bg-white rounded-xl border-gray-400 flex text-sm text-primary_black transition-ease-300"
        >
          <div className="w-[35%] flex-center gap-1 px-4">
            <Image
              crossOrigin="anonymous"
              width={50}
              height={50}
              alt={'User Pic'}
              src={`${USER_PROFILE_PIC_URL}/${membership.user.profilePic}`}
              className="w-8 h-8 rounded-full z-[1]"
            />
            <div className="w-[calc(100%-32px)] flex items-center flex-wrap gap-1">
              <div className="font-medium text-lg">{membership.user.name}</div>
              <div className="text-xs">@{membership.user.username}</div>
            </div>
          </div>
          <div className="w-[20%] flex-center">{membership.title}</div>
          <div className="w-[10%] flex-center">
            <div
              className="w-fit px-3 py-1 text-xs font-medium rounded-full"
              style={{ backgroundColor: getRoleColor(membership.role) }}
            >
              {membership.role}
            </div>
          </div>
          <div className="w-[20%] flex-center">{moment(membership.createdAt).format('DD MMMM, YYYY')}</div>
          <div className="w-[15%] flex-center gap-4">
            {project.userID == user.id || (org && checkOrgAccess(ORG_MANAGER)) ? (
              <Pen
                onClick={() => {
                  setClickedMembership(membership);
                  setClickedOnEditCollaborator(true);
                }}
                className="cursor-pointer"
                size={20}
              />
            ) : (
              membership.role != PROJECT_MANAGER &&
              user.managerProjects.includes(project.id) && (
                <Pen
                  onClick={() => {
                    setClickedMembership(membership);
                    setClickedOnEditCollaborator(true);
                  }}
                  className="cursor-pointer"
                  size={20}
                />
              )
            )}

            {(project.userID == user.id ||
              user.managerProjects.includes(project.id) ||
              (org && checkOrgAccess(ORG_MANAGER))) && (
              <Trash
                onClick={() => {
                  setClickedMembership(membership);
                  setClickedOnRemoveCollaborator(true);
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

export default CollaboratorsTable;
