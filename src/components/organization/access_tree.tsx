import { CheckSquare, X } from '@phosphor-icons/react';
import React, { useEffect } from 'react';

type ACCESS_TYPE =
  | 'post'
  | 'project'
  | 'event'
  | 'task'
  | 'chat'
  | 'membership'
  | 'profile'
  | 'resource'
  | 'opening'
  | 'meeting';

interface Props {
  type: ACCESS_TYPE;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Access {
  task: string;
  canMember: boolean;
  canSenior: boolean;
  canManager: boolean;
}

const accessDefinitions: Record<ACCESS_TYPE, Access[]> = {
  post: [
    { task: "See Organisation's Posts", canMember: true, canSenior: true, canManager: true },
    { task: 'Add new Posts', canMember: false, canSenior: true, canManager: true },
    { task: 'Edit Posts', canMember: false, canSenior: true, canManager: true },
    { task: 'Delete Posts', canMember: false, canSenior: true, canManager: true },
  ],
  chat: [
    { task: "See Organisation's Chats", canMember: true, canSenior: true, canManager: true },
    { task: 'Add new Chats', canMember: false, canSenior: true, canManager: true },
    { task: "Edit Chats' Details", canMember: false, canSenior: true, canManager: true },
    { task: 'Add members to Chats', canMember: false, canSenior: true, canManager: true },
    { task: 'Remove members from Chats', canMember: false, canSenior: true, canManager: true },
    { task: 'Delete Chats', canMember: false, canSenior: true, canManager: true },
  ],
  event: [
    { task: "See Organisation's Events", canMember: true, canSenior: true, canManager: true },
    { task: 'Add new Events', canMember: false, canSenior: true, canManager: true },
    { task: "Edit Events' Details", canMember: false, canSenior: true, canManager: true },
    { task: "Change Events' Coordinators", canMember: false, canSenior: true, canManager: true },
    { task: 'Delete Events', canMember: false, canSenior: true, canManager: true },
  ],
  membership: [
    { task: "See Organisation's Members", canMember: true, canSenior: true, canManager: true },
    { task: "See Organisation's Invitations", canMember: true, canSenior: true, canManager: true },
    { task: 'Invite new Members to Org', canMember: false, canSenior: false, canManager: true },
    { task: 'Withdraw Invitations', canMember: false, canSenior: false, canManager: true },
    { task: 'Edit Memberships of members', canMember: false, canSenior: false, canManager: true },
    { task: 'Edit Memberships of other managers', canMember: false, canSenior: false, canManager: false },
    { task: 'Remove members from Org', canMember: false, canSenior: false, canManager: true },
    { task: 'Remove other managers from Org', canMember: false, canSenior: false, canManager: false },
  ],
  profile: [
    { task: "See Organisation's Profile", canMember: true, canSenior: true, canManager: true },
    { task: "Edit Organisation's Details", canMember: false, canSenior: true, canManager: true },
    { task: "Change Organisation's Name", canMember: false, canSenior: false, canManager: false },
    { task: 'Delete Organisation', canMember: false, canSenior: false, canManager: false },
  ],
  project: [
    { task: "See Organisation's Projects", canMember: true, canSenior: true, canManager: true },
    { task: "See Projects' History", canMember: true, canSenior: true, canManager: true },
    { task: 'Add new Projects', canMember: false, canSenior: false, canManager: true },
    { task: "Edit Projects' Details", canMember: false, canSenior: true, canManager: true },
    { task: 'Add org members to Projects', canMember: false, canSenior: false, canManager: true },
    { task: 'Remove members from Projects', canMember: false, canSenior: false, canManager: true },
    { task: 'Delete Projects', canMember: false, canSenior: false, canManager: true },
  ],
  task: [
    { task: "See Organisation's Tasks", canMember: true, canSenior: true, canManager: true },
    { task: 'Add new Tasks', canMember: true, canSenior: true, canManager: true },
    { task: "Edit Tasks' Details", canMember: false, canSenior: true, canManager: true },
    { task: "Change Tasks' Users", canMember: false, canSenior: true, canManager: true },
    { task: 'Delete Tasks', canMember: false, canSenior: true, canManager: true },
  ],
  resource: [
    { task: 'Create Resource Buckets', canMember: false, canSenior: true, canManager: true },
    { task: 'Edit Resource Buckets', canMember: false, canSenior: true, canManager: true },
    { task: 'Delete Resource Buckets', canMember: false, canSenior: true, canManager: true },
  ],
  opening: [
    { task: 'Create Openings', canMember: false, canSenior: false, canManager: true },
    { task: 'Edit Openings', canMember: false, canSenior: false, canManager: true },
    { task: 'Delete Openings', canMember: false, canSenior: false, canManager: true },
    { task: 'Handle Applications', canMember: false, canSenior: false, canManager: true },
  ],
  meeting: [
    { task: 'Join Meetings', canMember: true, canSenior: true, canManager: true },
    { task: 'Create Meetings', canMember: false, canSenior: true, canManager: true },
    { task: 'Edit Meetings', canMember: false, canSenior: true, canManager: true },
    { task: 'Delete Meetings', canMember: false, canSenior: true, canManager: true },
    { task: 'Record Meetings', canMember: false, canSenior: true, canManager: true },
    { task: 'Generate Session Transcripts', canMember: false, canSenior: true, canManager: true },
    { task: 'Edit Meeting Participants', canMember: false, canSenior: true, canManager: true },
    { task: 'View Session Reports', canMember: true, canSenior: true, canManager: true },
    { task: 'View Meeting Recordings', canMember: true, canSenior: true, canManager: true },
  ],
};

const AccessTree = ({ type, setShow }: Props) => {
  const accessArr: Access[] = accessDefinitions[type];

  const renderChecks = (can: boolean) => {
    return can ? <CheckSquare size={20} /> : <X size={20} />;
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
      <div className="fixed top-24 max-md:top-20 w-1/2 max-lg:w-5/6 h-2/3 max-lg:h-5/6 bg-white dark:bg-dark_primary_comp flex flex-col gap-4 rounded-lg p-8 pt-0 dark:text-white font-primary overflow-auto border-[1px] border-primary_btn  dark:border-dark_primary_btn right-1/2 shadow-lg translate-x-1/2 thin_scrollbar animate-fade_third z-50 max-lg:z-[60]">
        <div className="font-semibold text-5xl max-md:text-2xl text-gray-800 dark:text-white mt-8">Access Tree</div>
        <div className="w-full h-full min-w-[520px] flex flex-col justify-between gap-4">
          <div className="w-full flex flex-col gap-4">
            <div className="w-full grid grid-cols-5 gap-2 text-center sticky top-0 pt-4 pb-2">
              <div className="col-span-2"></div>
              <div className="font-medium text-xl">Member</div>
              <div className="font-medium text-xl">Senior</div>
              <div className="font-medium text-xl">Manager</div>
            </div>
            {accessArr.map((access, index) => (
              <div key={index} className="w-full grid grid-cols-5 gap-2 items-center">
                <div className="col-span-2">{access.task}</div>
                <div className="flex-center">{renderChecks(access.canMember)}</div>
                <div className="flex-center">{renderChecks(access.canSenior)}</div>
                <div className="flex-center">{renderChecks(access.canManager)}</div>
              </div>
            ))}
          </div>
          {type == 'project' ? (
            <div className="w-full text-center mt-8 text-sm font-medium">
              Individual Project Memberships are also taken into account.
            </div>
          ) : (
            type == 'resource' && (
              <div className="w-full text-center mt-8 text-sm font-medium">
                Individual Resource Bucket Permissions are taken into account.
              </div>
            )
          )}
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className="bg-backdrop w-screen h-screen fixed top-0 left-0 animate-fade_third z-30 max-lg:z-[51]"
      ></div>
    </>
  );
};

export default AccessTree;
