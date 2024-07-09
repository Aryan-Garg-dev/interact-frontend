import React, { useState } from 'react';
import { CaretRight, Pen, Plus, X } from '@phosphor-icons/react';
import { GROUP_ADMIN } from '@/config/constants';
import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';
import { GROUP_CHAT_PIC_URL, INVITATION_URL, MESSAGING_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import { GroupChat, GroupChatMembership } from '@/types';
import { initialGroupChatMembership, initialInvitation } from '@/types/initials';
import EditMembership from './edit_group_membership';
import AddGroupMembers from './add_group_members';
import { SERVER_ERROR } from '@/config/errors';
import Toaster from '@/utils/toaster';
import patchHandler from '@/handlers/patch_handler';
import deleteHandler from '@/handlers/delete_handler';
import { useDispatch, useSelector } from 'react-redux';
import { setChats, userSelector } from '@/slices/userSlice';
import { setCurrentGroupChatID } from '@/slices/messagingSlice';
import ConfirmDelete from '@/components/common/confirm_delete';
import { resizeImage } from '@/utils/resize_image';
import Report from '@/components/common/report';

interface Props {
  chat: GroupChat;
  setChat: React.Dispatch<React.SetStateAction<GroupChat>>;
  membership: GroupChatMembership;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const GroupInfo = ({ chat, setChat, membership, setShow }: Props) => {
  const [clickedOnEditMembership, setClickedOnEditMembership] = useState(false);
  const [clickedEditUserMembership, setClickedEditUserMembership] = useState(initialGroupChatMembership);
  const [clickedOnAddMembers, setClickedOnAddMembers] = useState(false);
  const [clickedOnWithdrawInvitation, setClickedOnWithdrawInvitation] = useState(false);
  const [clickedInvitationToWithdraw, setClickedInvitationToWithdraw] = useState(initialInvitation);

  const [clickedOnEdit, setClickedOnEdit] = useState(false);
  const [clickedOnExit, setClickedOnExit] = useState(false);
  const [clickedOnReport, setClickedOnReport] = useState(false);

  const [title, setTitle] = useState(chat.title);
  const [description, setDescription] = useState(chat.description);
  const [isAdminOnly, setIsAdminOnly] = useState(chat.adminOnly);
  const [groupPic, setGroupPic] = useState<File>();
  const [groupPicView, setGroupPicView] = useState<string>(`${GROUP_CHAT_PIC_URL}/${chat.coverPic}`);

  const [mutex, setMutex] = useState(false);

  const chats = useSelector(userSelector).chats;

  const dispatch = useDispatch();

  const handleWithdrawInvitation = async () => {
    const toaster = Toaster.startLoad('Withdrawing Invitation...');

    const URL = `${INVITATION_URL}/withdraw/${clickedInvitationToWithdraw.id}`;

    const res = await deleteHandler(URL);

    if (res.statusCode === 204) {
      if (setChat)
        setChat(prev => {
          return {
            ...prev,
            invitations: prev.invitations.filter(inv => inv.id != clickedInvitationToWithdraw.id),
          };
        });
      setClickedOnWithdrawInvitation(false);
      Toaster.stopLoad(toaster, 'Invitation Withdrawn', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };

  const handleEdit = async () => {
    if (title.trim() == '') {
      Toaster.error('Title cannot be empty');
      return;
    }

    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Editing Group Details');

    const URL = `${MESSAGING_URL}/group/${chat.id}`;

    const formData = new FormData();
    if (groupPic) formData.append('coverPic', groupPic);
    if (title != chat.title) formData.append('title', title);
    if (description != chat.description) formData.append('description', description);
    formData.append('adminOnly', String(isAdminOnly));

    const res = await patchHandler(URL, formData, 'multipart/form-data');
    if (res.statusCode === 200) {
      const editedChat = res.data.chat;
      setChat(prev => {
        return {
          ...prev,
          title,
          description,
          coverPic: editedChat.coverPic,
        };
      });
      setGroupPic(undefined);
      setClickedOnEdit(false);
      Toaster.stopLoad(toaster, 'Group Details Edited!', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }

    setMutex(false);
  };

  const handleExit = async () => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Leaving Group');

    const URL = `${MESSAGING_URL}/group/leave/${chat.id}`;

    const res = await deleteHandler(URL);
    if (res.statusCode === 204) {
      dispatch(setChats(chats.filter(chatID => chatID != chat.id)));
      dispatch(setCurrentGroupChatID(''));
      Toaster.stopLoad(toaster, 'Group Left', 1);
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
      {clickedOnWithdrawInvitation ? (
        <ConfirmDelete
          setShow={setClickedOnWithdrawInvitation}
          handleDelete={handleWithdrawInvitation}
          title="Confirm Withdraw?"
        />
      ) : (
        <></>
      )}
      <div className="w-full h-full overflow-y-auto flex flex-col gap-4">
        {clickedOnEditMembership ? (
          <EditMembership
            membership={clickedEditUserMembership}
            setShow={setClickedOnEditMembership}
            setChat={setChat}
          />
        ) : (
          <></>
        )}
        {clickedOnAddMembers ? (
          <AddGroupMembers setShow={setClickedOnAddMembers} chat={chat} setChat={setChat} />
        ) : (
          <></>
        )}
        {clickedOnExit ? (
          <ConfirmDelete setShow={setClickedOnExit} handleDelete={handleExit} title="Confirm Exit?" />
        ) : (
          <></>
        )}
        {clickedOnReport ? <Report setShow={setClickedOnReport} /> : <></>}

        <div className="w-full flex items-center justify-between p-2">
          <div className="text-3xl font-semibold">Group Info</div>
          <X onClick={() => setShow(false)} className="cursor-pointer" size={32} />
        </div>

        <div
          className={`w-full rounded-md flex ${
            clickedOnEdit ? 'items-start max-lg:flex-col max-lg:items-center' : 'items-center'
          } gap-4 px-4`}
        >
          {clickedOnEdit ? (
            <>
              <input
                type="file"
                className="hidden"
                id="groupPic"
                multiple={false}
                onChange={async ({ target }) => {
                  if (target.files && target.files[0]) {
                    const file = target.files[0];
                    if (file.type.split('/')[0] == 'image') {
                      const resizedPic = await resizeImage(file, 500, 500);
                      setGroupPicView(URL.createObjectURL(resizedPic));
                      setGroupPic(resizedPic);
                    } else Toaster.error('Only Image Files can be selected');
                  }
                }}
              />
              <label
                className="relative w-14 h-14 max-lg:w-32 max-lg:h-32 rounded-full cursor-pointer"
                htmlFor="groupPic"
              >
                <div className="w-14 h-14 max-lg:w-32 max-lg:h-32 absolute top-0 right-0 rounded-full flex-center bg-white transition-ease-200 opacity-0 hover:opacity-50">
                  <Pen color="black" size={24} />
                </div>
                <Image
                  crossOrigin="anonymous"
                  className="w-14 h-14 max-lg:w-32 max-lg:h-32 rounded-full object-cover"
                  width={50}
                  height={50}
                  alt="/"
                  src={groupPicView}
                />
              </label>
              <div className="grow flex flex-col pt-1 gap-2">
                <div className="w-full flex items-center justify-between pr-2">
                  <input
                    type="text"
                    className="text-2xl max-lg:text-center font-medium bg-transparent focus:outline-none"
                    autoFocus={true}
                    maxLength={25}
                    value={title}
                    onChange={el => setTitle(el.target.value)}
                  />
                  <div className="max-lg:hidden flex gap-2">
                    <X onClick={() => setClickedOnEdit(false)} className="cursor-pointer" size={24} />
                    <CaretRight onClick={handleEdit} className="cursor-pointer" size={24} />
                  </div>
                </div>

                <textarea
                  className="text-sm bg-transparent focus:outline-none min-h-[64px] max-h-36"
                  maxLength={250}
                  placeholder="Group Description"
                  value={description}
                  onChange={el => setDescription(el.target.value)}
                />

                <label className="flex w-fit cursor-pointer select-none items-center text-sm gap-2">
                  <div>Admin Only Chat</div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isAdminOnly}
                      onChange={() => setIsAdminOnly(prev => !prev)}
                      className="sr-only"
                    />
                    <div
                      className={`box block h-6 w-10 rounded-full ${
                        isAdminOnly ? 'bg-blue-300' : 'bg-black'
                      } transition-ease-300`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${
                        isAdminOnly ? 'translate-x-full' : ''
                      }`}
                    ></div>
                  </div>
                </label>

                <div className="lg:hidden w-full flex justify-end">
                  <X onClick={() => setClickedOnEdit(false)} className="cursor-pointer" size={24} />
                  <CaretRight onClick={handleEdit} className="cursor-pointer" size={24} />
                </div>
              </div>
            </>
          ) : (
            <>
              <Image
                crossOrigin="anonymous"
                className="w-14 h-14 rounded-full object-cover"
                width={50}
                height={50}
                alt="/"
                src={`${GROUP_CHAT_PIC_URL}/${chat.coverPic}`}
              />
              <div className="grow flex flex-col">
                <div className="w-full flex items-center justify-between pr-2">
                  <div className="text-2xl font-medium">{chat.title}</div>
                  {membership.role == GROUP_ADMIN ? (
                    <Pen onClick={() => setClickedOnEdit(true)} className="cursor-pointer" size={24} />
                  ) : (
                    <></>
                  )}
                </div>

                <div className="text-sm">{chat.description}</div>
              </div>
            </>
          )}
        </div>

        <div className="w-full  rounded-md flex flex-col gap-4 p-4">
          <div className="text-xl font-semibold">
            {chat.memberships.length} Participant{chat.memberships.length == 1 ? '' : 's'}
          </div>
          <div className="w-full flex flex-col gap-1">
            {membership.role == GROUP_ADMIN ? (
              <div
                onClick={() => setClickedOnAddMembers(true)}
                className="w-full h-12 p-4 bg-primary_comp_hover dark:bg-dark_primary_comp_hover rounded-md flex items-center justify-between cursor-pointer"
              >
                <div className="text-lg">Add Members</div>
                <Plus size={32} />
              </div>
            ) : (
              <></>
            )}
            {chat.memberships.map(m => {
              return (
                <div
                  key={m.id}
                  className="w-full py-4 dark:p-4 dark:bg-dark_primary_comp_hover rounded-md flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <Link href={`/explore/user/${m.user.username}`} className="rounded-full">
                      <Image
                        crossOrigin="anonymous"
                        width={50}
                        height={50}
                        alt={'User Pic'}
                        src={`${USER_PROFILE_PIC_URL}/${m.user.profilePic}`}
                        className="rounded-full w-14 h-14"
                      />
                    </Link>
                    <div className="flex flex-col">
                      <Link href={`/explore/user/${m.user.username}`} className="text-xl font-medium">
                        {m.user.name}
                      </Link>
                      <div className="text-sm">{m.role}</div>
                    </div>
                  </div>
                  {membership.role == GROUP_ADMIN && membership.id != m.id ? (
                    <Pen
                      onClick={() => {
                        setClickedEditUserMembership(m);
                        setClickedOnEditMembership(true);
                      }}
                      className="cursor-pointer"
                      size={24}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full  rounded-md flex flex-col gap-4 p-4">
          <div className="text-xl font-semibold">
            {chat.invitations.length} Pending Invitation{chat.invitations.length == 1 ? '' : 's'}
          </div>
          <div className="w-full flex flex-col gap-1">
            {chat.invitations.map(invitation => {
              return (
                <div
                  key={invitation.id}
                  className="w-full py-4 dark:p-4 dark:bg-dark_primary_comp_hover rounded-md flex items-center justify-between"
                >
                  <Link href={`/explore/user/${invitation.user.username}`} className="flex items-center gap-4">
                    <Image
                      crossOrigin="anonymous"
                      width={50}
                      height={50}
                      alt={'User Pic'}
                      src={`${USER_PROFILE_PIC_URL}/${invitation.user.profilePic}`}
                      className="rounded-full w-14 h-14"
                    />

                    <div className="flex flex-col">
                      <div className="text-xl font-medium">{invitation.user.name}</div>
                      <div className="text-sm">@{invitation.user.username}</div>
                    </div>
                  </Link>
                  {membership.role == GROUP_ADMIN ? (
                    <div
                      onClick={() => {
                        setClickedInvitationToWithdraw(invitation);
                        setClickedOnWithdrawInvitation(true);
                      }}
                      className="text-xs text-primary_danger cursor-pointer"
                    >
                      Withdraw Invitation
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {chat.adminOnly ? (
          <div className="text-center opacity-75 text-xs">
            This is an <span className="font-semibold">Admin Only</span> chat.
          </div>
        ) : (
          <></>
        )}

        <div className="text-center opacity-75 text-sm">
          Created By{' '}
          <Link
            href={`/explore/user/${chat.user.username}`}
            target="_blank"
            className="font-semibold underline underline-offset-2"
          >
            {chat.user.name}
          </Link>{' '}
          on {moment(chat.createdAt).format('DD MMM YYYY')}
        </div>

        <div className="w-full  rounded-md flex flex-col gap-1 p-4">
          <div
            onClick={() => setClickedOnExit(true)}
            className="w-full py-4 text-center dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active text-primary_danger rounded-lg cursor-pointer transition-ease-300"
          >
            Exit Group
          </div>
          <div
            onClick={() => setClickedOnReport(true)}
            className="w-full py-4 text-center dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active text-primary_danger rounded-lg cursor-pointer transition-ease-300"
          >
            Report Group
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupInfo;
