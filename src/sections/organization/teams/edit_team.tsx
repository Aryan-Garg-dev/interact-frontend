import { ORG_URL } from '@/config/routes';
import { Team } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useState } from 'react';
import { SERVER_ERROR } from '@/config/errors';
import { currentOrgIDSelector } from '@/slices/orgSlice';
import { useSelector } from 'react-redux';
import PrimaryButton from '@/components/buttons/primary_btn';
import TextArea from '@/components/form/textarea';
import patchHandler from '@/handlers/patch_handler';
import Tags from '@/components/form/tags';
import Color from '@/components/form/color';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  team: Team;
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const EditTeam = ({ setShow, team, setTeams }: Props) => {
  const [description, setDescription] = useState(team.description);
  const [color, setColor] = useState(team.color);
  const [tags, setTags] = useState(team.tags);
  const [mutex, setMutex] = useState(false);

  const currentOrgID = useSelector(currentOrgIDSelector);

  const handleSubmit = async () => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Editing team');

    const URL = `${ORG_URL}/${currentOrgID}/teams/${team.id}`;

    const formData = {
      description,
      color,
      tags,
    };

    const res = await patchHandler(URL, formData);
    if (res.statusCode === 200) {
      const teamData = res.data.team;
      setTeams(prev => [...prev, teamData]);
      setShow(false);
      Toaster.stopLoad(toaster, 'New Team Added!', 1);
      return 1;
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
      setMutex(false);
      return 0;
    }
  };

  return (
    <>
      <div className="fixed top-24 max-md:top-20 w-[640px] max-md:w-5/6 backdrop-blur-2xl bg-white dark:bg-[#ffe1fc22] flex flex-col gap-4 rounded-lg p-10 max-md:p-5 dark:text-white font-primary border-[1px] border-primary_btn  dark:border-dark_primary_btn right-1/2 translate-x-1/2 animate-fade_third z-50">
        <div className="text-3xl max-md:text-xl font-semibold">Task Info</div>
        <div className="w-full h-[420px] flex flex-col gap-4">
          <div className="w-full flex flex-col gap-4">
            <TextArea label="Team Description" val={description} setVal={setDescription} maxLength={500} />
            <Tags label="Team Tags" tags={tags} setTags={setTags} maxTags={5} />
            <Color label="Team Color" val={color} setVal={color => setColor(color.hex)} />
          </div>
        </div>
        <div className="w-full flex justify-end">
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

export default EditTeam;
