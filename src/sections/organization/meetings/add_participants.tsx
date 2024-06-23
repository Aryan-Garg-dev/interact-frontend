import { ORG_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import { Meeting, User } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { SERVER_ERROR } from '@/config/errors';
import moment from 'moment';
import { currentOrgIDSelector } from '@/slices/orgSlice';
import { useSelector } from 'react-redux';
import PrimaryButton from '@/components/buttons/primary_btn';
import Input from '@/components/form/input';
import TextArea from '@/components/form/textarea';
import Tags from '@/components/form/tags';
import Time from '@/components/form/time';
import Checkbox from '@/components/form/checkbox';
import getHandler from '@/handlers/get_handler';
import Loader from '@/components/common/loader';
import { userIDSelector } from '@/slices/userSlice';
import { initialMeeting } from '@/types/initials';
import Select from '@/components/form/select';
import { getFormattedTime } from '@/utils/funcs/time';

interface Props {
  meeting: Meeting;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setMeeting: React.Dispatch<React.SetStateAction<Meeting>>;
}

const EditMeeting = ({ meeting, setShow, setMeeting }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const userID = useSelector(userIDSelector);

  const fetchUsers = async (search: string, abortController?: AbortController) => {
    setLoading(true);
    const URL = `${ORG_URL}/${currentOrgID}/meetings/non-participants/?search=${search}&limit=${10}&isOpenForMembers=${
      meeting.isOpenForMembers
    }&allowExternalParticipants=${meeting.allowExternalParticipants}`;

    const res = await getHandler(URL, abortController?.signal);
    if (res.statusCode == 200) {
      const userData: User[] = res.data.users || [];
      setUsers(userData.filter(u => u.id != userID));
      setLoading(false);
    } else {
      if (res.status != -1) {
        if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
        else Toaster.error(SERVER_ERROR, 'error_toaster');
      }
    }
  };
  const handleClickUser = (user: User) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(prev => prev.filter(u => u.id != user.id));
    } else {
      setSelectedUsers(prev => [...prev, user]);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchUsers(search, abortController);

    return () => {
      abortController.abort();
    };
  }, [search]);

  const currentOrgID = useSelector(currentOrgIDSelector);

  const handleSubmit = async () => {
    const toaster = Toaster.startLoad('Adding Participants');

    const URL = `${ORG_URL}/${currentOrgID}/meetings/participants/${meeting.id}`;

    const formData = {
      userIDs: selectedUsers.map(u => u.id),
    };

    const res = await postHandler(URL, formData);
    if (res.statusCode === 200) {
      setShow(false);
      Toaster.stopLoad(toaster, 'Participants Added!', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
  };

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  return (
    <>
      <div className="fixed top-12 max-md:top-20 w-[640px] max-md:w-5/6 backdrop-blur-2xl bg-white flex flex-col gap-6 rounded-lg px-2 py-10 max-md:p-5 font-primary border-[1px] border-primary_btn right-1/2 translate-x-1/2 animate-fade_third z-50">
        <div className="text-3xl max-md:text-xl font-semibold px-8">Add Users</div>
        <div className="w-full max-h-[540px] overflow-y-auto flex flex-col gap-4 px-8">
          <div className="w-full h-12 flex items-center px-4 gap-4 dark:bg-dark_primary_comp_hover rounded-md">
            <MagnifyingGlass size={24} />
            <input
              className="grow bg-transparent focus:outline-none font-medium"
              placeholder="Search"
              value={search}
              onChange={el => setSearch(el.target.value)}
            />
          </div>
          <div className="w-full flex-1 flex flex-col gap-2 overflow-y-auto">
            {loading ? (
              <Loader />
            ) : (
              users.map(user => {
                return (
                  <div
                    key={user.id}
                    onClick={() => handleClickUser(user)}
                    className={`w-full flex gap-2 rounded-lg p-2 ${
                      selectedUsers.includes(user)
                        ? 'dark:bg-dark_primary_comp_active bg-primary_comp_hover'
                        : 'dark:bg-dark_primary_comp hover:bg-primary_comp dark:hover:bg-dark_primary_comp_hover'
                    } cursor-pointer transition-ease-200`}
                  >
                    <Image
                      crossOrigin="anonymous"
                      width={50}
                      height={50}
                      alt={'User Pic'}
                      src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
                      className={'rounded-full w-12 h-12 cursor-pointer border-[1px] border-black'}
                    />
                    <div className="w-5/6 flex flex-col">
                      <div className="text-lg font-bold">{user.name}</div>
                      <div className="text-sm dark:text-gray-200">@{user.username}</div>
                      {user.tagline && user.tagline != '' && <div className="text-sm mt-2">{user.tagline}</div>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="w-full flex justify-end px-8">
          <PrimaryButton onClick={handleSubmit} label="Submit" animateIn={false} />
        </div>
      </div>

      <div
        onClick={() => setShow(false)}
        className="bg-backdrop w-screen h-screen fixed top-0 left-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default EditMeeting;
