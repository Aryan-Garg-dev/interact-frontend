import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { Application } from '@/types';
import moment from 'moment';
import Image from 'next/image';
import React from 'react';
import ToolTip from '../utils/tooltip';
import { getApplicationStatus, getApplicationStatusColor } from '@/utils/funcs/application';

interface Props {
  applications: Application[];
  setClickedOnApplication: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedApplicationID: React.Dispatch<React.SetStateAction<number>>;
}

const ApplicationsTable = ({ applications, setClickedOnApplication, setClickedApplicationID }: Props) => {
  return (
    <div className="w-full flex flex-col gap-2 px-8">
      <div className="w-full h-12 bg-white rounded-xl border-gray-400 flex font-semibold max-md:text-sm text-primary_black">
        <div className="w-[35%] max-md:w-[40%] flex-center">Name</div>
        <div className="w-[15%] flex-center relative group">
          <ToolTip
            content="Generated by AI✨"
            styles={{
              fontSize: '10px',
              padding: '4px',
              width: '140px',
              top: '50%',
              left: '50%',
              translate: '-50% -50%',
              border: 'none',
            }}
          />
          Score
        </div>
        <div className="w-[15%] max-md:hidden flex-center">Conversations</div>
        <div className="w-[15%] max-md:w-[20%] flex-center">Status</div>
        <div className="w-[20%] max-md:w-[25%] flex-center">Applied On</div>
      </div>
      {applications.map((application, index) => (
        <div
          key={application.id}
          onClick={() => {
            setClickedApplicationID(index);
            setClickedOnApplication(true);
          }}
          className="w-full h-12 bg-white rounded-xl border-gray-400 flex text-sm text-primary_black transition-ease-300 cursor-pointer"
        >
          <div className="w-[35%] max-md:w-[40%] flex-center gap-1 px-4">
            <Image
              crossOrigin="anonymous"
              width={50}
              height={50}
              alt={'User Pic'}
              src={`${USER_PROFILE_PIC_URL}/${application.user.profilePic}`}
              placeholder="blur"
              blurDataURL={application.user.profilePicBlurHash || 'no-hash'}
              className="w-8 h-8 rounded-full z-[1]"
            />
            <div className="w-[calc(100%-32px)] flex max-md:flex-col items-center flex-wrap gap-1 max-md:gap-0">
              <div className="max-md:w-full font-medium text-base max-md:text-sm line-clamp-1">
                {application.user.name}
              </div>
              <div className="max-md:w-full text-xs max-md:text-xxs line-clamp-1">@{application.user.username}</div>
            </div>
          </div>
          <div className="w-[15%] flex-center">
            {application.score != -1 ? (
              <div className="text-gradient font-semibold">{(application.score * 100).toFixed(2)}%</div>
            ) : (
              '-'
            )}
          </div>
          <div className="w-[15%] max-md:hidden flex-center">{application.noComments}</div>
          <div className="w-[15%] max-md:w-[20%] flex-center gap-1 px-4">
            <div
              className="w-fit px-3 max-md:px-2 py-1 text-xs font-medium max-md:text-xxs rounded-full"
              style={{ backgroundColor: getApplicationStatusColor(application.status) }}
            >
              {getApplicationStatus(application.status)}
            </div>
          </div>
          <div className="w-[20%] max-md:w-[25%] flex-center max-md:text-xxs">
            {moment(application.createdAt).format('DD MMMM, YYYY')}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationsTable;
