import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Project } from '@/types';
import { initialProject } from '@/types/initials';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Buildings, CaretLeft, CaretRight, X } from '@phosphor-icons/react';
import LowerProject from '@/components/lowers/lower_project';
import ProjectViewLoader from '@/components/loaders/explore_project_view';
import Collaborators from '@/components/explore/collaborators';
import Openings from '@/components/explore/show_openings';
import Link from 'next/link';
import Links from '@/components/explore/show_links';
import { useSwipeable } from 'react-swipeable';
import SimilarProjects from '@/components/explore/similar_projects';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';
import LowerWorkspaceProject from '@/components/lowers/lower_workspace_project';
import renderContentWithLinks from '@/utils/funcs/render_content_with_links';
import { getProjectPicHash, getProjectPicURL } from '@/utils/funcs/safe_extract';

interface Props {
  projectSlugs: string[];
  clickedProjectIndex: number;
  setClickedProjectIndex: React.Dispatch<React.SetStateAction<number>>;
  setClickedOnProject: React.Dispatch<React.SetStateAction<boolean>>;
  fadeIn: boolean;
  setFadeIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProjectView = ({
  projectSlugs,
  clickedProjectIndex,
  setClickedProjectIndex,
  setClickedOnProject,
  fadeIn,
  setFadeIn,
}: Props) => {
  const [project, setProject] = useState<Project>(initialProject);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);

  const [clickedOnReadMore, setClickedOnReadMore] = useState(false);
  const user = useSelector(userSelector);

  const fetchProject = async (abortController: AbortController) => {
    setLoading(true);
    let slug = '';
    try {
      slug = projectSlugs[clickedProjectIndex];
    } finally {
      const URL = `${EXPLORE_URL}/projects/${slug}`;
      const res = await getHandler(URL, abortController.signal);
      if (res.statusCode == 200) {
        setProject(res.data.project);

        const action = new URLSearchParams(window.location.search).get('action');
        if (action && action == 'comments') setShowComments(true);

        setLoading(false);
      } else {
        if (res.status != -1) {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else Toaster.error(SERVER_ERROR, 'error_toaster');
        }
      }
    }
  };

  const isProjectMember = (project: Project) => {
    const projectID = project.id;
    return (
      user.memberProjects.includes(projectID) ||
      user.editorProjects.includes(projectID) ||
      user.managerProjects.includes(projectID) ||
      user.ownerProjects.includes(projectID)
    );
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchProject(abortController);

    return () => {
      abortController.abort();
    };
  }, [clickedProjectIndex]);

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  const swipeHandler = useSwipeable({
    onSwipedRight: () => {
      if (clickedProjectIndex != 0) {
        setClickedProjectIndex(prev => prev - 1);
        setFadeIn(false);
      }
    },
    onSwipedLeft: () => {
      if (clickedProjectIndex != projectSlugs.length - 1) {
        setClickedProjectIndex(prev => prev + 1);
        setFadeIn(false);
      }
    },
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      setClickedProjectIndex(prev => prev - 1);
      setFadeIn(false);
    } else if (event.key === 'ArrowRight') {
      setClickedProjectIndex(prev => prev + 1);
      setFadeIn(false);
    } else if (event.key === 'Escape') {
      setClickedOnProject(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return loading ? (
    <ProjectViewLoader fadeIn={fadeIn} setClickedOnProject={setClickedOnProject} />
  ) : (
    <div
      {...swipeHandler}
      className="w-screen h-screen dark:text-white font-primary fixed top-0 left-0 z-[150] flex dark:bg-backdrop backdrop-blur-2xl"
    >
      <div className="max-lg:hidden w-16 h-screen flex flex-col items-center py-3 justify-between max-lg:fixed max-lg:top-0 max-lg:left-0">
        <div className="w-10 h-10 relative">
          <Image
            crossOrigin="anonymous"
            width={50}
            height={50}
            alt={'User Pic'}
            src={`${USER_PROFILE_PIC_URL}/${project.user.profilePic}`}
            placeholder="blur"
            blurDataURL={project.user.profilePicBlurHash || 'no-hash'}
            className={'w-10 h-10 rounded-full cursor-default absolute top-0 left-0 z-10'}
          />
        </div>
        {clickedProjectIndex != 0 && (
          <div
            onClick={() => {
              setClickedProjectIndex(prev => prev - 1);
              setFadeIn(false);
            }}
            className="w-10 h-10 rounded-full flex-center dark:bg-dark_primary_comp_hover cursor-pointer shadow-xl"
          >
            <CaretLeft size={24} weight="bold" />
          </div>
        )}
      </div>

      <div className="w-[calc(100vw-128px)] max-lg:w-screen h-screen pt-3">
        <div className="w-full h-14 flex justify-between max-lg:px-3">
          <div className="grow flex gap-2 max-lg:gap-4">
            <Image
              crossOrigin="anonymous"
              width={100}
              height={100}
              alt={'User Pic'}
              src={`${USER_PROFILE_PIC_URL}/${project.user.profilePic}`}
              placeholder="blur"
              blurDataURL={project.user.profilePicBlurHash || 'no-hash'}
              className={'lg:hidden w-10 h-10 rounded-full cursor-default'}
            />
            <div>
              <div className="w-fit font-bold cursor-default line-clamp-1">{project.title}</div>
              <div className="w-fit flex items-center gap-1 text-xs font-medium">
                <div
                  onClick={() =>
                    window.location.assign(
                      `/explore/${project.user.isOrganization ? 'organisation' : 'user'}/${project.user.username}`
                    )
                  }
                  className="cursor-pointer hover-underline-animation after:bg-black"
                >
                  {project.user.name}
                </div>
                {project.user.isOrganization ? (
                  <Buildings />
                ) : (
                  project.memberships?.length > 0 && (
                    <div className="flex-center">+ {project.memberships.length} others</div>
                  )
                )}
              </div>
            </div>
          </div>
          <div
            onClick={() => setClickedOnProject(false)}
            className="lg:hidden w-10 h-10 rounded-full flex-center dark:bg-dark_primary_comp_hover cursor-pointer"
          >
            <X size={24} weight="bold" />
          </div>
        </div>

        <div className="w-full h-[calc(100vh-56px)] shadow-xl max-lg:overflow-y-auto flex max-lg:flex-col">
          <Image
            priority={true}
            crossOrigin="anonymous"
            className="w-[calc(100vh-56px)] max-lg:w-full h-full max-lg:h-96 rounded-tl-md max-lg:rounded-none object-cover"
            src={getProjectPicURL(project)}
            alt="Project Cover"
            width={10000}
            height={10000}
            placeholder="blur"
            blurDataURL={getProjectPicHash(project)}
          />

          <div className="w-[calc(100vw-128px-(100vh-56px))] lg:h-full lg:overflow-y-auto max-lg:w-full border-gray-300 border-t-[1px] border-r-[1px] dark:border-0 p-4 bg-white dark:bg-dark_primary_comp_hover flex flex-col gap-6 z-10">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div className="font-bold text-4xl text-gradient">{project.title}</div>
              <div className="lg:hidden w-fit">
                {isProjectMember(project) ? (
                  <LowerWorkspaceProject project={project} />
                ) : (
                  <LowerProject project={project} />
                )}
              </div>
            </div>
            <div className="font-semibold text-lg">{project.tagline}</div>

            <div className="text-sm whitespace-pre-line">
              {project.description.length > 200 ? (
                clickedOnReadMore ? (
                  project.description
                ) : (
                  <>
                    {project.description.substring(0, 200)}
                    <span
                      onClick={() => setClickedOnReadMore(true)}
                      className="text-xs italic opacity-60 cursor-pointer"
                    >
                      {' '}
                      Read More...
                    </span>
                  </>
                )
              ) : (
                renderContentWithLinks(project.description)
              )}
            </div>
            <div className="w-full flex flex-wrap gap-2">
              {project.tags &&
                project.tags.map(tag => {
                  return (
                    <Link
                      href={`/explore?search=${tag}&tab=projects`}
                      target="_blank"
                      key={tag}
                      className="flex-center p-2 font-primary text-xs dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn bg-gray-200 dark:bg-[#20032c41] rounded-lg"
                    >
                      {tag}
                    </Link>
                  );
                })}
            </div>
            {isProjectMember(project) && (
              <Link href={'/workspace?pid=' + project.id} className="w-fit flex-center gap-1 font-semibold">
                <div className="hover-underline-animation after:bg-gray-700">Open in workspace</div>
                <ArrowUpRight size={18} weight="bold" />
              </Link>
            )}
            {
              //TODO Project Owner Details
            }
            <Collaborators memberships={project.memberships} />
            <Links links={project.links} />
            <Openings openings={project.openings} slug={project.slug} projectCoverPic={getProjectPicURL(project)} />
            <SimilarProjects slug={project.slug} />
          </div>
        </div>
      </div>

      <div className="max-lg:hidden w-16 h-screen flex flex-col items-center justify-between py-3 max-lg:fixed max-lg:top-0 max-lg:right-0">
        <div
          onClick={() => setClickedOnProject(false)}
          className="w-10 h-10 rounded-full flex-center dark:bg-dark_primary_comp_hover cursor-pointer"
        >
          <X size={24} weight="bold" />
        </div>

        <div className="max-lg:hidden">
          {isProjectMember(project) ? (
            <LowerWorkspaceProject project={project} initialCommentShowState={showComments} />
          ) : (
            <LowerProject project={project} initialCommentShowState={showComments} />
          )}
        </div>

        {clickedProjectIndex != projectSlugs.length - 1 ? (
          <div
            onClick={() => {
              setClickedProjectIndex(prev => prev + 1);
              setFadeIn(false);
            }}
            className="w-10 h-10 rounded-full flex-center dark:bg-dark_primary_comp_hover cursor-pointer shadow-xl"
          >
            <CaretRight size={24} weight="bold" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full"></div>
        )}
      </div>
      <div className="lg:hidden fixed bottom-3 w-full flex justify-between px-3 z-20">
        {clickedProjectIndex != 0 ? (
          <div
            onClick={() => {
              setClickedProjectIndex(prev => prev - 1);
              setFadeIn(false);
            }}
            className="w-10 h-10 rounded-full flex-center dark:bg-dark_primary_comp_hover cursor-pointer shadow-xl"
          >
            <CaretLeft size={24} weight="bold" />
          </div>
        ) : (
          <div></div>
        )}
        {clickedProjectIndex != projectSlugs.length - 1 && (
          <div
            onClick={() => {
              setClickedProjectIndex(prev => prev + 1);
              setFadeIn(false);
            }}
            className="w-10 h-10 rounded-full flex-center dark:bg-dark_primary_comp_hover cursor-pointer shadow-xl"
          >
            <CaretRight size={24} weight="bold" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectView;
