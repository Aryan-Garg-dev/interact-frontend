import { OPENING_URL, ORG_URL } from '@/config/routes';
import { Opening, Project } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useState } from 'react';
import Image from 'next/image';
import Tags from '@/components/utils/edit_tags';
import patchHandler from '@/handlers/patch_handler';
import { SERVER_ERROR } from '@/config/errors';
import { useSelector } from 'react-redux';
import { currentOrgSelector } from '@/slices/orgSlice';
import PrimaryButton from '@/components/buttons/primary_btn';
import { getProjectPicHash, getProjectPicURL } from '@/utils/funcs/safe_extract';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  opening: Opening;
  project: Project;
  setProject?: React.Dispatch<React.SetStateAction<Project>>;
  org?: boolean;
}

const EditOpening = ({ setShow, opening, project, setProject, org = false }: Props) => {
  const [description, setDescription] = useState(opening.description);
  const [tags, setTags] = useState<string[]>(opening.tags || []);
  const [active, setActive] = useState(opening.active);

  const [mutex, setMutex] = useState(false);

  const currentOrgID = useSelector(currentOrgSelector).id;

  const handleSubmit = async () => {
    if (tags.length == 0) {
      Toaster.error('Tags Cannot be Empty');
      return;
    }

    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Editing your opening...');

    const formData = {
      description,
      tags,
      active,
    };

    const URL = org ? `${ORG_URL}/${currentOrgID}/openings/${opening.id}` : `${OPENING_URL}/${opening.id}`;

    const res = await patchHandler(URL, formData);

    if (res.statusCode === 200) {
      if (setProject)
        setProject(prev => {
          let openings = prev.openings;
          openings = openings.map(oldOpening => {
            if (oldOpening.id == opening.id) {
              return { ...oldOpening, description, tags, active };
            } else return oldOpening;
          });
          return { ...prev, openings };
        });
      Toaster.stopLoad(toaster, 'Opening Edited', 1);
      setShow(false);
    } else {
      Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  return (
    <>
      <div className="fixed top-24 max-lg:top-20 w-[953px] max-lg:w-5/6 h-[580px] max-lg:h-2/3 backdrop-blur-2xl bg-white dark:bg-[#ffe1fc22] flex flex-col justify-between gap-4 rounded-lg p-8 dark:text-white font-primary overflow-y-auto border-[1px] border-gray-400  dark:border-dark_primary_btn right-1/2 translate-x-1/2 animate-fade_third z-30">
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex max-lg:flex-col gap-8 max-lg:gap-4 max-md:items-center items-start">
            <Image
              crossOrigin="anonymous"
              width={100}
              height={100}
              alt={'User Pic'}
              src={getProjectPicURL(project)}
              className={'w-[180px] h-[180px] max-lg:w-[120px] max-lg:h-[120px] rounded-lg object-cover'}
              placeholder="blur"
              blurDataURL={getProjectPicHash(project)}
            />
            <div className="grow flex flex-col gap-2 max-md:text-center">
              <div className="w-full text-4xl max-lg:text-3xl font-bold text-gradient cursor-default">
                {opening.title}
              </div>
              <div className="text-xl font-medium cursor-default">@{project.title}</div>

              <div className="w-full flex flex-col gap-2 my-4">
                <div className="text-xs ml-1 font-medium uppercase text-gray-500">Tags ({tags.length || 0}/10)</div>
                <Tags tags={tags} setTags={setTags} maxTags={10} />
              </div>

              <label className="w-fit flex max-lg:flex-col max-md:text-center max-lg:mt-2 items-center max-lg:items-start max-md:items-center text-sm gap-2">
                <div className="w-fit flex cursor-pointer select-none items-center gap-2">
                  <div>Opening Active</div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => setActive(prev => !prev)}
                      className="sr-only"
                    />
                    <div
                      className={`box block h-6 w-10 rounded-full ${
                        active ? 'bg-blue-300' : 'bg-black'
                      } transition-ease-300`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${
                        active ? 'translate-x-full' : ''
                      }`}
                    ></div>
                  </div>
                </div>

                <div className="text-xs">
                  (setting it to inactive will automatically reject all pending applications)
                </div>
              </label>
            </div>
          </div>

          <div className="w-full">
            <div className="text-xs ml-1 font-medium uppercase text-gray-500">
              Description ({description.trim().length}/500)
            </div>
            <textarea
              value={description}
              onChange={el => setDescription(el.target.value)}
              placeholder="add a professional bio"
              maxLength={500}
              className="w-full min-h-[160px] max-h-[200px] focus:outline-none text-primary_black border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg p-2 text-sm bg-transparent"
            />
          </div>
        </div>
        <div className="w-full flex justify-end">
          <div className="w-full flex justify-end">
            <PrimaryButton onClick={handleSubmit} width="40" label="Edit Opening" />
          </div>
        </div>
      </div>

      <div
        onClick={() => setShow(false)}
        className="bg-backdrop w-screen h-screen fixed top-0 left-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default EditOpening;
