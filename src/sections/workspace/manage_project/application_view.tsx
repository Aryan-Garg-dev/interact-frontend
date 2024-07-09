import { Application } from '@/types';
import React, { useEffect, useState } from 'react';
import { APPLICATION_RESUME_URL, APPLICATION_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import Image from 'next/image';
import getIcon from '@/utils/funcs/get_icon';
import Link from 'next/link';
import { ArrowUpRight, X } from '@phosphor-icons/react';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import getDomainName from '@/utils/funcs/get_domain_name';
import socketService from '@/config/ws';
import { SERVER_ERROR } from '@/config/errors';
import { initialApplication } from '@/types/initials';
import ConfirmDelete from '@/components/common/confirm_delete';
import { useSelector } from 'react-redux';
import { currentOrgIDSelector } from '@/slices/orgSlice';
import moment from 'moment';
import Tags from '@/components/common/tags';
import renderContentWithLinks from '@/utils/funcs/render_content_with_links';
import CommentBox from '@/components/comment/comment_box';

interface Props {
  applicationIndex: number;
  applications: Application[];
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setApplications?: React.Dispatch<React.SetStateAction<Application[]>>;
  setFilteredApplications?: React.Dispatch<React.SetStateAction<Application[]>>;
  projectID?: string;
  org?: boolean;
}

const ApplicationView = ({
  applicationIndex,
  applications,
  setShow,
  setApplications,
  setFilteredApplications,
  projectID,
  org = false,
}: Props) => {
  const [clickedOnAccept, setClickedOnAccept] = useState(false);
  const [clickedOnReject, setClickedOnReject] = useState(false);
  const [mutex, setMutex] = useState(false);

  const application = applications[applicationIndex] || initialApplication;

  const currentOrgID = useSelector(currentOrgIDSelector);

  const handleAccept = async () => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Accepting the Application...');

    const URL = org
      ? `/org/${currentOrgID}/applications/accept/${application.id}`
      : `${APPLICATION_URL}/accept/${application.id}`;

    const res = await getHandler(URL);
    if (res.statusCode === 200) {
      if (setApplications) {
        setApplications(prev =>
          prev.map(a => {
            if (a.id == application.id) {
              return { ...a, status: 2 };
            } else return a;
          })
        );
      }
      if (setFilteredApplications) {
        setFilteredApplications(prev =>
          prev.map(a => {
            if (a.id == application.id) {
              return { ...a, status: 2 };
            } else return a;
          })
        );
      }
      socketService.sendNotification(
        application.userID,
        `Your Application for ${org ? application.organization?.title : application.project?.title} got Selected!`
      );
      setClickedOnAccept(false);
      Toaster.stopLoad(toaster, 'Application accepted!', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }

    setMutex(false);
  };

  const handleReject = async () => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Rejecting the Application...');

    const URL = org
      ? `/org/${currentOrgID}/applications/reject/${application.id}`
      : `${APPLICATION_URL}/reject/${application.id}`;

    const res = await getHandler(URL);
    if (res.statusCode === 200) {
      if (setApplications) {
        setApplications(prev =>
          prev.map(a => {
            if (a.id == application.id) {
              return { ...a, status: -1 };
            } else return a;
          })
        );
      }
      if (setFilteredApplications) {
        setFilteredApplications(prev =>
          prev.map(a => {
            if (a.id == application.id) {
              return { ...a, status: -1 };
            } else return a;
          })
        );
      }
      socketService.sendNotification(
        application.userID,
        `Your Application for ${org ? application.organization?.title : application.project?.title} got Rejected.`
      );
      setClickedOnReject(false);
      Toaster.stopLoad(toaster, 'Application rejected', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }

    setMutex(false);
  };

  const handleShortlist = async () => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Adding/Removing from Shortlist...');

    const URL = org
      ? `/org/${currentOrgID}/applications/review/${application.id}`
      : `${APPLICATION_URL}/review/${application.id}`;

    const res = await getHandler(URL);
    if (res.statusCode === 200) {
      if (setApplications) {
        setApplications(prev =>
          prev.map(a => {
            if (a.id == application.id) {
              return { ...a, status: application.status == 1 ? 0 : 1 };
            } else return a;
          })
        );
      }
      if (setFilteredApplications) {
        setFilteredApplications(prev =>
          prev.map(a => {
            if (a.id == application.id) {
              return { ...a, status: application.status == 1 ? 0 : 1 };
            } else return a;
          })
        );
      }
      Toaster.stopLoad(
        toaster,
        application.status == 1 ? 'Application removed from shortlist' : 'Application Shortlisted',
        1
      );
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }

    setMutex(false);
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
      {clickedOnAccept && (
        <ConfirmDelete
          setShow={setClickedOnAccept}
          handleDelete={handleAccept}
          title="Confirm Accept?"
          subtitle="You can later add/remove users from your project"
        />
      )}
      {clickedOnReject && (
        <ConfirmDelete setShow={setClickedOnReject} handleDelete={handleReject} title="Confirm Reject?" />
      )}
      <div className="fixed w-no_side_base_open h-base top-navbar bg-white overflow-y-auto flex flex-col justify-between gap-8 p-8 font-primary z-10 animate-fade_third">
        <div className="w-full flex flex-col gap-6">
          <X
            className="fixed top-20 right-4 cursor-pointer"
            size={32}
            onClick={() => {
              setShow(false);
            }}
          />
          <div className="w-full flex max-lg:flex-col items-center gap-4">
            <Image
              crossOrigin="anonymous"
              width={100}
              height={100}
              alt={'User Pic'}
              src={`${USER_PROFILE_PIC_URL}/${application.user.profilePic}`}
              className="rounded-full w-36 h-36"
            />
            <div className="w-[calc(100%-144px)] max-lg:w-3/5 max-md:w-full flex flex-col max-lg:items-center max-lg:text-center gap-1">
              <Link
                target="_blank"
                href={`/explore/user/${application.user.username}`}
                className="flex items-center gap-1"
              >
                <div className="text-2xl font-semibold hover-underline-animation after:bg-black">
                  {application.user.name}
                </div>
                <ArrowUpRight size={24} />
              </Link>
              <div className="font-medium">{application.user.tagline}</div>
              <div className="w-full flex justify-start max-lg:justify-center max-lg:mt-2 gap-6">
                <div className="flex gap-1">
                  <div className="font-bold">{application.user.noFollowers}</div>
                  <div>Follower{application.user.noFollowers != 1 ? 's' : ''}</div>
                </div>
                <div className="flex gap-1">
                  <div className="font-bold">{application.user.noFollowing}</div>
                  <div>Following</div>
                </div>
              </div>
              <div className="w-full flex flex-wrap items-center justify-start max-lg:justify-center gap-2 mt-2">
                {application.user.tags && <Tags tags={application.user.tags} displayAll={true} />}
              </div>
            </div>
          </div>
          {application.links && application.links.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="text-lg font-medium">Attached Links:</div>
              {application.links.map((link, index) => {
                return (
                  <Link key={index} href={link} target="_blank">
                    {getIcon(getDomainName(link), 32)}
                  </Link>
                );
              })}
            </div>
          )}

          {application.email != '' && (
            <div className="flex items-center gap-2 max-lg:w-3/5 max-md:w-full max-lg:text-center max-lg:mx-auto">
              <div className="text-lg font-medium">Shared Email:</div>
              <Link href={`mailto:${application.email}`} className="">
                {application.email}
              </Link>
            </div>
          )}

          {application.resume && application.resume != '' && (
            <div className="flex items-center gap-2 max-lg:w-3/5 max-md:w-full max-lg:text-center max-lg:mx-auto">
              <div className="text-lg font-medium">Shared Resume:</div>
              <Link
                href={`${APPLICATION_RESUME_URL}/${application.resume}`}
                target="_blank"
                className="w-64 mx-auto p-2 flex-center bg-primary_comp dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active transition-ease-300 cursor-pointer rounded-lg font-medium text-lg"
              >
                View
              </Link>
            </div>
          )}

          <div className="max-lg:w-3/5 max-md:w-full max-lg:text-center max-lg:mx-auto">
            {renderContentWithLinks(application.content)}
          </div>

          <div className="w-fit h-fit text-xs">Applied {moment(application.createdAt).fromNow()}</div>
        </div>

        <div className="">
          <div className="text-xl font-medium">
            Conversations <span className="text-sm font-normal">(not visible to the applicant)</span>
          </div>
          <CommentBox
            item={application}
            type="application"
            userFetchURL={org ? `/org/${currentOrgID}/membership/members` : `/membership/members/${projectID}`}
          />
        </div>

        {(application.status == 0 || application.status == 1) && (
          <div className="w-full flex justify-center gap-12 max-lg:gap-4 border-t-[1px] border-primary_btn pt-4">
            <div
              onClick={() => setClickedOnAccept(true)}
              className="w-32 py-2 font-medium border-primary_btn bg-green-100 hover:bg-green-200 active:bg-priority_low flex-center rounded-lg transition-ease-300 cursor-pointer"
            >
              Accept
            </div>
            <div
              onClick={() => setClickedOnReject(true)}
              className="w-32 py-2 font-medium border-primary_btn bg-red-100 hover:bg-red-200 active:bg-priority_high flex-center rounded-lg transition-ease-300 cursor-pointer"
            >
              Reject
            </div>
            <div
              onClick={handleShortlist}
              className={`w-32 py-2 flex-center ${
                application.status == 0
                  ? 'hover:bg-priority_mid'
                  : 'bg-priority_mid border-[1px] border-primary_btn  dark:border-dark_primary_btn'
              } transition-ease-300 cursor-pointer rounded-lg font-medium`}
            >
              {application.status == 0 ? 'Shortlist' : 'Shortlisted'}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ApplicationView;
