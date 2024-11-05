import ProjectCard from '@/components/explore/project_card';
import { Project } from '@/types';
import React, { useEffect, useState } from 'react';
import ProjectView from '../../sides/project/project_view';
import NoUserItems from '@/components/fillers/user_items';
import { EXPLORE_URL } from '@/config/routes';
import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import Mascot from '@/components/fillers/mascot';

interface Props {
  userID: string;
  displayOnProfile?: boolean;
  contributing?: boolean;
  org?: boolean;
}

const Projects = ({ userID, displayOnProfile = false, contributing = false, org = false }: Props) => {
  const [clickedOnProject, setClickedOnProject] = useState(false);
  const [clickedProjectIndex, setClickedProjectIndex] = useState(-1);
  const [clickedOnNewProject, setClickedOnNewProject] = useState(false);

  const [fadeInProject, setFadeInProject] = useState(true);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const getProjects = () => {
    setLoading(true);
    const URL = `${EXPLORE_URL}/users/projects${contributing ? '/contributing' : ''}/${userID}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setProjects(res.data.projects || []);
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else {
            Toaster.error(SERVER_ERROR, 'error_toaster');
          }
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  useEffect(() => {
    getProjects();
  }, [userID, contributing]);

  return (
    <div>
      {/* {displayOnProfile && (
        <>
          {clickedOnNewProject ? <NewProject setShow={setClickedOnNewProject} setProjects={setProjects} /> : <></>}
          {checkOrgAccess(ORG_MANAGER) || loggedInUserID == userID ? (
            <div
              onClick={() => setClickedOnNewProject(true)}
              className={`mb-8 w-108 max-md:w-5/6 h-24 max-md:hover:scale-105 hover:scale-125 group relative overflow-clip bg-white hover:bg-[#f3f3f3] mx-auto border-[1px] pattern1 rounded-lg cursor-pointer flex-center flex-col transition-ease-300`}
            >
              <div className="backdrop-blur-md opacity-0 group-hover:opacity-60 w-2/3 h-2/3 rounded-xl transition-ease-out-300"></div>
              <div className="font-extrabold text-xl group-hover:text-2xl text-gradient absolute translate-y-0 group-hover:-translate-y-2 transition-ease-out-300">
                Create a new Project!
              </div>
              <div className="text-xs font-semibold text-primary_black absolute translate-x-0 translate-y-16 group-hover:translate-y-4 transition-ease-out-300">
                Woohooh! New Project! Who Dis?
              </div>
            </div>
          ) : (
            <></>
          )}
        </>
      )} */}
      <div className="w-full">
        {projects?.length > 0 ? (
          projects.map((project, index) => {
            return <ProjectCard key={project.id} index={index} project={project} isLink />;
          })
        ) : org ? (
          <div className="w-5/6 mx-auto">
            <Mascot message="This organization is as quiet as a library at midnight. Shh, no projects yet." />
          </div>
        ) : (
          <NoUserItems />
        )}
      </div>
    </div>
  );
};

export default Projects;
