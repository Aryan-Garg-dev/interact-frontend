import ProjectCard from '@/components/explore/project_card';
import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Project } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useState, useEffect } from 'react';
import ProjectView from '@/sections/explore/project_view';
import { useDispatch } from 'react-redux';
import { setExploreTab } from '@/slices/feedSlice';
import NoSearch from '@/components/fillers/search';
import InfiniteScroll from 'react-infinite-scroll-component';
import OrderMenu from '@/components/common/order_menu';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState('trending');

  const [clickedOnProject, setClickedOnProject] = useState(false);
  const [clickedProjectIndex, setClickedProjectIndex] = useState(-1);

  const [fadeInProjectView, setFadeInProjectView] = useState(true);

  const dispatch = useDispatch();
  const checkSet = new Set();

  const fetchProjects = async (search: string | null, initialPage?: number) => {
    const URL = `${EXPLORE_URL}/projects?page=${initialPage ? initialPage : page}&limit=${10}&order=${order}${
      search ? `&search=${search}` : ''
    }`;

    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      console.log(res.data.projects || []);
      if (initialPage == 1) {
        setProjects(res.data.projects || []);
      } else {
        const addedProjects = [...projects, ...(res.data.projects || [])];
        if (addedProjects.length === projects.length) setHasMore(false);
        setProjects(addedProjects);
      }
      setPage(prev => prev + 1);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  const fetchProject = async (id: string | null) => {
    setLoading(true);
    const URL = `${EXPLORE_URL}/projects/${id}`;

    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setProjects([res.data.project]);

      if (res.data.project) {
        setClickedProjectIndex(0);
        setClickedOnProject(true);
      }

      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  useEffect(() => {
    setPage(1);
    setProjects([]);
    setHasMore(true);
    setLoading(true);
    const pid = new URLSearchParams(window.location.search).get('pid');
    if (pid && pid != '') fetchProject(pid);
    else fetchProjects(new URLSearchParams(window.location.search).get('search'), 1);
  }, [window.location.search, order]);

  useEffect(() => {
    const oid = new URLSearchParams(window.location.search).get('oid');
    const action = new URLSearchParams(window.location.search).get('action');
    if (oid && action == 'external') dispatch(setExploreTab(1)); //TODO add tab query to this url

    const tab = new URLSearchParams(window.location.search).get('tab');
    if (tab && tab == 'projects') dispatch(setExploreTab(0));
    else if (tab && tab == 'openings') dispatch(setExploreTab(1));
    else if (tab && tab == 'users') dispatch(setExploreTab(2));
    else if (tab && tab == 'organisations') dispatch(setExploreTab(3));
  }, []);

  return (
    <div>
      {(projects.length > 0 || order == 'last_viewed') && (
        <OrderMenu
          orders={['trending', 'most_liked', 'most_viewed', 'latest', 'last_viewed']}
          current={order}
          setState={setOrder}
        />
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="w-full pt-4">
          {projects.length > 0 ? (
            <InfiniteScroll
              className="w-full"
              dataLength={projects.length}
              next={() => fetchProjects(new URLSearchParams(window.location.search).get('search'))}
              hasMore={hasMore}
              loader={<Loader />}
            >
              {clickedOnProject && (
                <ProjectView
                  projectSlugs={projects.map(project => project.slug)}
                  clickedProjectIndex={clickedProjectIndex}
                  setClickedProjectIndex={setClickedProjectIndex}
                  setClickedOnProject={setClickedOnProject}
                  fadeIn={fadeInProjectView}
                  setFadeIn={setFadeInProjectView}
                />
              )}
              {projects.map((project, index) => {
                if (checkSet.has(project.id)) {
                  return;
                } else {
                  checkSet.add(project.id);
                  return (
                    <ProjectCard
                      isLink
                      key={project.id}
                      index={index}
                      project={project}
                      setClickedOnProject={setClickedOnProject}
                      setClickedProjectIndex={setClickedProjectIndex}
                    />
                  );
                }
              })}
            </InfiniteScroll>
          ) : (
            <NoSearch />
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;
