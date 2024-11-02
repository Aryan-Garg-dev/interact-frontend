import Loader from '@/components/common/loader';
import ProjectCard from '@/components/workspace/project_card';
import { WORKSPACE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Project } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import ProjectView from '@/sections/workspace/project_view';
import NewProject from '@/sections/workspace/new_project';
import { userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';
import NoProjects from '@/components/fillers/your_projects';
import { navbarOpenSelector } from '@/slices/feedSlice';
import { SERVER_ERROR } from '@/config/errors';
import OrderMenu from '@/components/common/order_menu';

const CombinedProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState('activity');
  const [search, setSearch] = useState('');

  const [clickedOnProject, setClickedOnProject] = useState(false);
  const [clickedProjectIndex, setClickedProjectIndex] = useState(-1);

  const [clickedOnNewProject, setClickedOnNewProject] = useState(false);

  const [fadeIn, setFadeIn] = useState(true);

  const navbarOpen = useSelector(navbarOpenSelector);
  const user = useSelector(userSelector);

  const getProjects = (abortController: AbortController) => {
    setLoading(true);
    const URL = `${WORKSPACE_URL}/projects?order=${order}&search=${search}`;
    getHandler(URL, abortController.signal)
      .then(res => {
        if (res.statusCode === 200) {
          const projectsData = res.data.projects || [];
          setProjects(projectsData);
          const projectSlug = new URLSearchParams(window.location.search).get('project');
          if (projectSlug && projectSlug != '') {
            projectsData.forEach((project: Project, index: number) => {
              if (project.slug == projectSlug) {
                setClickedOnProject(true);
                setClickedProjectIndex(index);
              }
            });
          }
          setLoading(false);
        } else if (res.status != -1) {
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
    const action = new URLSearchParams(window.location.search).get('action');
    if (action && action == 'new_project') setClickedOnNewProject(true);
  }, []);

  let oldAbortController: AbortController | null = null;

  useEffect(() => {
    const abortController = new AbortController();
    if (oldAbortController) oldAbortController.abort();
    oldAbortController = abortController;

    getProjects(abortController);
    return () => {
      abortController.abort();
    };
  }, [order, search]);

  return (
    <div className="w-full">
      <OrderMenu orders={['activity', 'most_liked', 'most_viewed', 'latest']} current={order} setState={setOrder} />
      {loading ? (
        <Loader />
      ) : projects.length > 0 ? (
        <div className="w-full mt-4">
          {clickedOnProject && (
            <ProjectView
              projectSlugs={projects.map(project => project.slug)}
              clickedProjectIndex={clickedProjectIndex}
              clickedProject={projects[clickedProjectIndex]}
              setClickedProjectIndex={setClickedProjectIndex}
              setClickedOnProject={setClickedOnProject}
              fadeIn={fadeIn}
              setFadeIn={setFadeIn}
              setProjects={setProjects}
            />
          )}
          {projects.map((project, index) => {
            return (
              <ProjectCard
                key={project.id}
                index={index}
                project={project}
                setClickedOnProject={setClickedOnProject}
                setClickedProjectIndex={setClickedProjectIndex}
              />
            );
          })}
        </div>
      ) : (
        <NoProjects setClickedOnNewProject={setClickedOnNewProject} />
      )}
    </div>
  );
};

export default CombinedProjects;
