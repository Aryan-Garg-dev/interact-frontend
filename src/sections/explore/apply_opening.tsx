import ProjectCardCarousel from '@/components/explore/project_card_carousel';
import Links from '@/components/utils/edit_links';
import { SERVER_ERROR } from '@/config/errors';
import { APPLICATION_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import socketService from '@/config/ws';
import postHandler from '@/handlers/post_handler';
import { setApplications, userSelector } from '@/slices/userSlice';
import { Opening } from '@/types';
import Toaster from '@/utils/toaster';
import { ArrowUpRight, X } from '@phosphor-icons/react';
import moment from 'moment';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  opening: Opening;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setOpening: React.Dispatch<React.SetStateAction<Opening>>;
  setAddResume: React.Dispatch<React.SetStateAction<boolean>>;
  org?: boolean;
}

const ApplyOpening = ({ opening, setShow, setOpening, setAddResume, org = false }: Props) => {
  const [content, setContent] = useState('');
  const [links, setLinks] = useState<string[]>([]);
  const [includeEmail, setIncludeEmail] = useState(false);
  const [includeResume, setIncludeResume] = useState(false);
  const [yoe, setYoe] = useState(0);

  const user = useSelector(userSelector);
  let profilePic = user.profilePic;

  const applications = useSelector(userSelector).applications;

  const dispatch = useDispatch();

  useEffect(() => {
    profilePic;
  }, [opening]);

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    profilePic = profilePic == '' ? 'default.jpg' : profilePic;

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  const handleSubmit = async () => {
    if (content.trim() == '') {
      Toaster.error('Message cannot be Empty', 'validation_error');
      return;
    }
    const toaster = Toaster.startLoad('Applying to Opening...');

    const formData = { content, links, includeEmail, includeResume, yoe };

    const URL = org ? `/org/${opening.organizationID}/applications/${opening.id}` : `${APPLICATION_URL}/${opening.id}`;

    const res = await postHandler(URL, formData);
    if (res.statusCode === 201) {
      setOpening(prev => {
        return { ...prev, noApplications: prev.noApplications + 1 };
      });
      dispatch(setApplications([...applications, opening.id]));
      socketService.sendNotification(opening.userID, `${user.name} applied at an opening!`);
      Toaster.stopLoad(toaster, 'Applied to the Opening!', 1);
      setShow(false);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };

  return (
    <>
      <div className="w-2/3 h-[560px] max-lg:h-base_md max-lg:overflow-y-auto max-md:w-screen max-md:h-screen dark:text-white fixed backdrop-blur-lg bg-white dark:bg-dark_primary_comp z-50 max-lg:z-[100] translate-x-1/2 -translate-y-1/4 max-md:translate-y-0 top-64 max-lg:top-1/4 max-md:top-0 right-1/2 flex flex-col font-primary p-8 gap-6 border-2 border-primary_btn dark:border-dark_primary_btn rounded-xl max-md:rounded-none animate-fade_third">
        <div className="w-fit text-gradient mx-auto text-3xl max-md:text-2xl text-primary_black flex justify-between items-center gap-2 font-bold">
          Your Application
        </div>
        <div onClick={() => setShow(false)} className="md:hidden absolute top-4 right-4">
          <X size={24} weight="bold" />
        </div>
        <div className="w-full h-full flex max-lg:flex-col gap-4 items-center">
          <div className="w-1/3 h-full max-lg:h-fit max-lg:w-full font-primary dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg p-4 flex-center flex-col gap-4 max-lg:gap-4 transition-ease-300 cursor-default">
            {org ? (
              <Image
                crossOrigin="anonymous"
                width={200}
                height={200}
                alt={'User Pic'}
                src={`${USER_PROFILE_PIC_URL}/${opening.organization?.user.profilePic}`}
                placeholder="blur"
                blurDataURL={opening.organization?.user.profilePicBlurHash || 'no-hash'}
                className={
                  'w-[240px] h-[240px] max-lg:hidden max-lg:w-[120px] max-lg:h-[120px] rounded-lg object-cover'
                }
              />
            ) : (
              opening.project && <ProjectCardCarousel project={opening.project} />
            )}

            <div className="w-full flex flex-col gap-4 max-lg:gap-2 px-8">
              <div className="w-full flex flex-col items-center gap-1">
                <div className="w-fit font-bold text-center line-clamp-2 text-2xl text-gradient">{opening.title}</div>
                <div className="text-sm text-center">@{org ? opening.organization?.title : opening.project?.title}</div>
                <div className="text-xs font-thin">{moment(opening.createdAt).fromNow()}</div>
              </div>
            </div>
          </div>
          <div className="w-2/3 h-full max-lg:w-full flex max-lg:flex-col gap-4">
            <div className="w-1/2 max-lg:w-full h-full flex flex-col gap-2 relative">
              <textarea
                value={content}
                onChange={el => {
                  setContent(el.target.value);
                }}
                maxLength={500}
                className="w-full px-4 py-2 rounded-lg text-black dark:text-white bg-primary_comp dark:bg-dark_primary_comp_hover min-h-[27rem] max-h-[27rem] focus:outline-none"
                placeholder="Add a Message of maximum 500 characters"
              />
            </div>
            <div className="w-1/2 max-lg:w-full h-full flex flex-col justify-between max-lg:gap-2 max-lg:pb-8">
              <div className="w-full flex flex-col gap-4">
                <div className="w-full flex flex-col gap-2">
                  <div className="text-xs ml-1 font-medium uppercase text-gray-500">Links ({links.length || 0}/3)</div>
                  <Links links={links} setLinks={setLinks} maxLinks={3} />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <div className="text-xs ml-1 font-medium uppercase text-gray-500">Years of Experience</div>
                  <input
                    value={yoe}
                    onChange={el => {
                      const val = Number(el.target.value);
                      if (val >= 0 && val <= 50) setYoe(val);
                    }}
                    type="number"
                    className="w-full font-medium bg-transparent focus:outline-none border-[1px] border-gray-400 dark:border-dark_primary_btn rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="w-full flex flex-col gap-2 max-md:pt-8">
                {user.resume == '' ? (
                  <div onClick={() => setAddResume(true)} className="flex gap-2 items-center">
                    <ArrowUpRight weight="bold" size={24} />{' '}
                    <div className="font-medium cursor-pointer hover-underline-animation after:bg-black dark:after:bg-white">
                      Upload your resume
                    </div>
                  </div>
                ) : (
                  <div className="flex">
                    <div className="w-8">
                      <label className="checkBox w-5 h-5">
                        <input onClick={() => setIncludeResume(prev => !prev)} type="checkbox" />
                        <div className="transition-ease-300 !bg-primary_black"></div>
                      </label>
                    </div>

                    <div className="font-medium cursor-default">
                      Share my Resume! <span className="text-xs ml-1"></span>
                    </div>
                  </div>
                )}

                <div className="flex">
                  <div className="w-8">
                    <label className="checkBox w-5 h-5">
                      <input onClick={() => setIncludeEmail(prev => !prev)} type="checkbox" />
                      <div className="transition-ease-300 !bg-primary_black"></div>
                    </label>
                  </div>

                  <div className="font-medium cursor-default">
                    Share my Email! <span className="text-xs ml-1">(recommended)</span>
                  </div>
                </div>

                <div
                  className="h-10 rounded-xl max-lg:mt-6 dark:bg-dark_primary_comp_hover bg-primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active flex-center text-lg cursor-pointer dark:hover:bg-dark_primary_comp_active dark:active:bg-dark_primary_comp_active transition-ease-300"
                  onClick={handleSubmit}
                >
                  Apply!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className=" bg-backdrop w-screen h-screen backdrop-blur-sm fixed top-0 right-0 animate-fade_third z-40 max-lg:z-[90]"
      ></div>
    </>
  );
};

export default ApplyOpening;
