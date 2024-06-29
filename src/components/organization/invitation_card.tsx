import { Invitation, Organization } from '@/types';
import React, { useState } from 'react';
import Image from 'next/image';
import { ORG_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import { useSelector } from 'react-redux';
import moment from 'moment';
import getInvitationStatus from '@/utils/funcs/get_invitation_status';
import { SERVER_ERROR } from '@/config/errors';
import deleteHandler from '@/handlers/delete_handler';
import Toaster from '@/utils/toaster';
import ConfirmDelete from '@/components/common/confirm_delete';
import checkOrgAccess from '@/utils/funcs/check_org_access';
import { ORG_MANAGER } from '@/config/constants';
import { currentOrgIDSelector } from '@/slices/orgSlice';

interface Props {
  invitation: Invitation;
  setOrganization?: React.Dispatch<React.SetStateAction<Organization>>;
}

const InvitationCard = ({ invitation, setOrganization }: Props) => {
  const [clickedOnWithdraw, setClickedOnWithdraw] = useState(false);
  const currentOrgID = useSelector(currentOrgIDSelector);

  const handleWithdraw = async () => {
    const toaster = Toaster.startLoad('Withdrawing Invitation...');

    const URL = `${ORG_URL}/${currentOrgID}/membership/withdraw/${invitation.id}`;

    const res = await deleteHandler(URL);

    if (res.statusCode === 204) {
      if (setOrganization)
        setOrganization(prev => {
          return {
            ...prev,
            invitations: prev.invitations.filter(inv => inv.id != invitation.id),
          };
        });
      setClickedOnWithdraw(false);
      Toaster.stopLoad(toaster, 'Invitation Withdrawn', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };

  return (
    <>
      {clickedOnWithdraw ? (
        <ConfirmDelete setShow={setClickedOnWithdraw} handleDelete={handleWithdraw} title="Confirm Withdraw?" />
      ) : (
        <></>
      )}
      <div className="w-[49%] hover:scale-105 font-primary bg-white hover:shadow-xl dark:bg-transparent dark:text-white border-[1px] border-primary_btn dark:border-dark_primary_btn rounded-md flex justify-start gap-6 p-4 transition-ease-300">
        <Image
          crossOrigin="anonymous"
          width={50}
          height={50}
          alt={'User Pic'}
          src={`${USER_PROFILE_PIC_URL}/${invitation.user.profilePic}`}
          className={'rounded-full w-16 h-16'}
        />
        <div className="grow flex flex-col gap-2 pt-1">
          <div className="w-full flex items-center justify-between">
            <div className="grow flex flex-col gap-2">
              <div className="text-2xl font-semibold">{invitation.user.name}</div>
              <div className="font-medium">{invitation.title}</div>
              <div className="font-medium">{'Member'}</div>
            </div>
            <div className="text-lg font-medium pr-4 cursor-default">{getInvitationStatus(invitation.status)}</div>
          </div>

          <div className="w-full flex items-center justify-between text-sm">
            <div className="text-gray-400">Sent {moment(invitation.createdAt).format('DD MMM YYYY')}</div>
            {invitation.status == 0 ? (
              <>
                {checkOrgAccess(ORG_MANAGER) ? (
                  <div onClick={() => setClickedOnWithdraw(true)} className="text-primary_danger cursor-pointer">
                    Withdraw Invitation
                  </div>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InvitationCard;
