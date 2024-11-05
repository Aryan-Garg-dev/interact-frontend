import ProjectCard from '@/components/explore/project_card';
import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL, PROJECT_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Project } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setExploreTab } from '@/slices/feedSlice';
import NoSearch from '@/components/fillers/search';
import InfiniteScroll from 'react-infinite-scroll-component';
import OrderMenu from '@/components/common/order_menu';
import { useSelector } from 'react-redux';
import { userIDSelector } from '@/slices/userSlice';
import { useWindowWidth } from '@react-hook/window-size';

const Projects = ({
  setClickedProject,
}: {
  setClickedProject?: React.Dispatch<React.SetStateAction<Project | null>>;
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState('trending');

  const dispatch = useDispatch();
  const checkSet = new Set();

  const fetchProjects = async (search: string | null, initialPage?: number) => {
    const URL = `${EXPLORE_URL}/projects?page=${initialPage ? initialPage : page}&limit=${10}&order=${order}${
      search ? `&search=${search}` : ''
    }`;

    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      const projectsData = res.data.projects || [];

      if (initialPage == 1) {
        setProjects(projectsData);
      } else {
        const addedProjects = [...projects, ...projectsData];
        if (addedProjects.length === projects.length) setHasMore(false);
        setProjects(addedProjects);
      }
      setPage(prev => prev + 1);

      if (setClickedProject && projectsData.length > 0)
        setClickedProject(prev => {
          if (prev) return prev;
          return projectsData[0];
        });

      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  const fetchProject = async (id: string | null) => {
    setLoading(true);
    const URL = `${PROJECT_URL}/${id}`;

    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      const project = res.data.project;
      if (project) {
        setProjects([project]);
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
    const pid = new URLSearchParams(window.location.search).get('id');
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

  const userID = useSelector(userIDSelector);

  const width = useWindowWidth();
  const isMD = width < 768;

  return (
    <div>
      {(projects.length > 0 || order == 'last_viewed') && (
        <OrderMenu
          orders={
            userID
              ? ['trending', 'most_liked', 'most_viewed', 'latest', 'last_viewed']
              : ['trending', 'most_liked', 'most_viewed', 'latest']
          }
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
              {projects.map((project, index) => {
                if (checkSet.has(project.id)) {
                  return;
                } else {
                  checkSet.add(project.id);
                  return (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      setClickedProject={setClickedProject}
                      isLink={isMD}
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
