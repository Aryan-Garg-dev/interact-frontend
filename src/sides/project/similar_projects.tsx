import React, { useEffect, useState } from 'react';
import { Project } from '@/types';
import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import ProjectCard from '../../components/explore/project_card';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../../components/common/loader';
import { SidePrimeWrapper } from '@/wrappers/side';

interface Props {
  slug: string;
}

const SimilarProjects = ({ slug }: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchProjects = () => {
    const URL = `${EXPLORE_URL}/projects/similar/${slug}?page=${page}&limit=${6}`;
    getHandler(URL, undefined, true)
      .then(res => {
        if (res.statusCode === 200) {
          const addedProjects = Array.from(new Set([...projects, ...(res.data.projects || [])]));
          if (addedProjects.length === projects.length) setHasMore(false);
          setProjects(addedProjects);
          setPage(prev => prev + 1);
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
    setPage(1);
    setProjects([]);
    fetchProjects();
  }, [slug]);

  return projects.length > 0 ? (
    <SidePrimeWrapper>
      <div className="w-full flex flex-col gap-2">
        <div className="text-lg font-semibold">Similar Projects</div>
        <InfiniteScroll
          className="w-full"
          dataLength={projects.length}
          next={() => fetchProjects()}
          hasMore={hasMore}
          loader={<Loader />}
        >
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} isLink smaller />
          ))}
        </InfiniteScroll>
      </div>
    </SidePrimeWrapper>
  ) : (
    <></>
  );
};

export default SimilarProjects;
