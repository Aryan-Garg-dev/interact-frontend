import ColoredTag from '@/components/common/colored_tag';
import ConfirmDelete from '@/components/common/confirm_delete';
import ConfirmOTP from '@/components/common/confirm_otp';
import { ORG_MANAGER, PROJECT_MANAGER } from '@/config/constants';
import { SERVER_ERROR } from '@/config/errors';
import { MEMBERSHIP_URL, ORG_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import deleteHandler from '@/handlers/delete_handler';
import getHandler from '@/handlers/get_handler';
import EditMember from '@/sections/organization/members/edit_member';
import EditMembership from '@/sections/workspace/manage_project/edit_collaborator';
import { currentOrgSelector } from '@/slices/orgSlice';
import { setOrganizationMemberships, userSelector } from '@/slices/userSlice';
import { Organization, OrganizationMembership, Project } from '@/types';
import { initialOrganizationMembership } from '@/types/initials';
import checkOrgAccess from '@/utils/funcs/check_org_access';
import Toaster from '@/utils/toaster';
import { Pen, Trash } from '@phosphor-icons/react';
import moment from 'moment';
import Image from 'next/image';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

interface Props {
  memberships: OrganizationMembership[];
  organization: Organization;
  setOrganization: React.Dispatch<React.SetStateAction<Organization>>;
}

const OrgMembersTable = ({ memberships, organization, setOrganization }: Props) => {
  const [clickedMembership, setClickedMembership] = useState(initialOrganizationMembership);
  const [clickedOnEditMembership, setClickedOnEditMembership] = useState(false);
  const [clickedOnRemoveMember, setClickedOnRemoveMember] = useState(false);
  const [clickedOnLeaveOrg, setClickedOnLeaveOrg] = useState(false);
  const [clickedOnConfirmLeave, setClickedOnConfirmLeave] = useState(false);

  const user = useSelector(userSelector);
  const currentOrg = useSelector(currentOrgSelector);

  const dispatch = useDispatch();

  const handleRemove = async () => {
    const toaster = Toaster.startLoad('Removing Member...');

    const URL = `${ORG_URL}/${currentOrg.id}/membership/${clickedMembership.id}`;

    const res = await deleteHandler(URL);
    if (res.statusCode === 204) {
      setOrganization(prev => {
        return {
          ...prev,
          memberships: prev.memberships.filter(m => m.id != clickedMembership.id),
        };
      });
      setClickedOnRemoveMember(false);
      Toaster.stopLoad(toaster, 'Member Removed', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };

  const sendOTP = async () => {
    const toaster = Toaster.startLoad('Sending OTP');

    const URL = `${ORG_URL}/${currentOrg.id}/membership/delete`;

    const res = await getHandler(URL);
    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'OTP Sent to your registered mail', 1);
      setClickedOnLeaveOrg(false);
      setClickedOnConfirmLeave(true);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };

  const handleLeaveOrg = async (otp: string) => {
    const toaster = Toaster.startLoad('Leaving Organisation...');

    const URL = `${ORG_URL}/${currentOrg.id}/membership`;

    const res = await deleteHandler(URL, { otp });
    if (res.statusCode === 204) {
      dispatch(
        setOrganizationMemberships(
          user.organizationMemberships.filter(membership => membership.organizationID != currentOrg.id)
        )
      );
      Toaster.stopLoad(toaster, 'Left Organisation', 1);
      setClickedOnConfirmLeave(false);
      window.location.assign('/home');
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };
  return (
    <div className="w-full flex flex-col gap-2">
      {clickedOnEditMembership && (
        <EditMember
          membership={clickedMembership}
          organization={organization}
          setShow={setClickedOnEditMembership}
          setOrganization={setOrganization}
        />
      )}
      {clickedOnRemoveMember && (
        <ConfirmDelete setShow={setClickedOnRemoveMember} handleDelete={handleRemove} title="Confirm Remove?" />
      )}
      {clickedOnLeaveOrg && (
        <ConfirmDelete setShow={setClickedOnLeaveOrg} handleDelete={sendOTP} title="Leave Organisation?" />
      )}
      {clickedOnConfirmLeave && <ConfirmOTP setShow={setClickedOnConfirmLeave} handleSubmit={handleLeaveOrg} />}

      <div className="w-full h-12 bg-white rounded-xl border-gray-400 flex font-semibold text-primary_black">
        <div className="w-[30%] flex-center">Name</div>
        <div className="w-[20%] flex-center">Title</div>
        <div className="w-[20%] flex-center">Teams</div>
        <div className="w-[10%] flex-center">Role</div>
        <div className="w-[10%] flex-center">Joined At</div>
        {checkOrgAccess(ORG_MANAGER) && <div className="w-[10%] flex-center"></div>}
      </div>
      {memberships.map(membership => (
        <div
          key={membership.user.id}
          className="w-full h-14 bg-white rounded-xl border-gray-400 flex text-sm text-primary_black transition-ease-300"
        >
          <div className="w-[30%] flex-center gap-2 px-4">
            <Image
              crossOrigin="anonymous"
              width={50}
              height={50}
              alt={'User Pic'}
              src={`${USER_PROFILE_PIC_URL}/${membership.user.profilePic}`}
              className="w-8 h-8 rounded-full z-[1]"
            />
            <div className="w-[calc(100%-24px)] flex items-center flex-wrap gap-1">
              <div className="font-medium text-lg">{membership.user.name}</div>
              <div className="text-xs">@{membership.user.username}</div>
            </div>
          </div>
          <div className="w-[20%] flex-center">{membership.title}</div>
          <div className="w-[20%] flex-center">
            {membership.teams &&
              membership.teams.length > 0 &&
              membership.teams.map(team => <ColoredTag key={team.id} tag={team.title} color={team.color} />)}
          </div>

          <div className="w-[10%] flex-center">{membership.role}</div>
          <div className="w-[10%] flex-center">{moment(membership.createdAt).format('DD MMMM, YYYY')}</div>
          {checkOrgAccess(ORG_MANAGER) ? (
            <div className="w-[10%] flex-center gap-4">
              {user.id != membership.userID && (
                <Pen
                  onClick={() => {
                    setClickedMembership(membership);
                    setClickedOnEditMembership(true);
                  }}
                  className="cursor-pointer"
                  size={20}
                />
              )}
              {user.id != membership.userID ? (
                <Trash
                  onClick={() => {
                    setClickedMembership(membership);
                    setClickedOnRemoveMember(true);
                  }}
                  className="cursor-pointer"
                  size={20}
                />
              ) : (
                <div
                  onClick={() => setClickedOnLeaveOrg(true)}
                  className="text-primary_danger font-medium cursor-pointer"
                >
                  Leave
                </div>
              )}
            </div>
          ) : (
            user.id == membership.userID && (
              <div
                onClick={() => setClickedOnLeaveOrg(true)}
                className="w-[10%] flex-center text-primary_danger font-medium cursor-pointer"
              >
                Leave
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default OrgMembersTable;
