import Sidebar from '@/components/common/sidebar';
import { SERVER_ERROR } from '@/config/errors';
import { PROJECT_PIC_URL, PROJECT_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Project } from '@/types';
import { initialProject } from '@/types/initials';
import { getProjectPicHash, getProjectPicURL } from '@/utils/funcs/safe_extract';
import Toaster from '@/utils/toaster';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import PrimeWrapper from '@/wrappers/prime';
import SideBarWrapper, { SidePrimeWrapper } from '@/wrappers/side';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import renderContentWithLinks from '@/utils/funcs/render_content_with_links';
import CommentProject from '@/sections/lowers/comment_project';
import UserSideCard from '@/components/explore/user_side_card';
import SimilarProjects from '@/sides/project/similar_projects';
import Openings from '@/sides/project/openings';
import Tags from '@/components/common/tags';
import Links from '@/components/explore/show_links';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setEditorProjects, setManagerProjects, setMemberProjects, userSelector } from '@/slices/userSlice';
import { checkOrgProjectAccess, checkProjectAccess } from '@/utils/funcs/access';
import { ORG_SENIOR, PROJECT_EDITOR, PROJECT_MANAGER, PROJECT_MEMBER } from '@/config/constants';
import LowerProject from '@/components/lowers/lower_project';
import EditProject from '@/sections/workspace/edit_project';
import { PencilSimple } from '@phosphor-icons/react/dist/ssr';
import EditProjectImages from '@/sections/workspace/edit_project_images';
import Tasks from '@/sections/workspace/tasks';
import Collaborators from '@/sides/project/collaborators';
import Activity from '@/sides/project/activity';

const ProjectComponent = ({ slug }: { slug: string }) => {
  const [project, setProject] = useState<Project>(initialProject);
  const [loading, setLoading] = useState(true);

  const [clickedOnReadMore, setClickedOnReadMore] = useState(false);
  const [clickedOnEditProjectImages, setClickedOnEditProjectImages] = useState(false);

  const user = useSelector(userSelector);

  const dispatch = useDispatch();

  const fetchProject = async () => {
    const URL = `${PROJECT_URL}/${slug}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setProject(res.data.project);
      const membership = res.data.membership;
      if (membership && !checkProjectAccess(PROJECT_MEMBER, project.id)) {
        if (membership.role === PROJECT_MEMBER) dispatch(setMemberProjects([...user.memberProjects, project.id]));
        else if (membership.role === PROJECT_EDITOR) dispatch(setEditorProjects([...user.editorProjects, project.id]));
        else if (membership.role === PROJECT_MANAGER)
          dispatch(setManagerProjects([...user.managerProjects, project.id]));
      }
      setLoading(false);
    } else {
      Toaster.error(res.data.message || SERVER_ERROR, 'error_toaster');
    }
  };

  useEffect(() => {
    fetchProject();
  }, [slug]);
  return (
    <BaseWrapper title="Projects">
      <Sidebar index={2} />
      <MainWrapper restrictWidth sidebarLayout>
        <div className="w-2/3">
          <PrimeWrapper>
            <div className="w-full flex flex-col gap-8">
              <div className="w-full relative group">
                {checkOrgProjectAccess(PROJECT_EDITOR, project.id, ORG_SENIOR, project.organization) && (
                  <>
                    <EditProjectImages
                      project={project}
                      setProject={setProject}
                      isDialogOpen={clickedOnEditProjectImages}
                      setIsDialogOpen={setClickedOnEditProjectImages}
                    />
                    <div
                      onClick={() => setClickedOnEditProjectImages(true)}
                      className="w-full h-full absolute top-0 right-0 flex-center gap-2 hover:bg-[#ffffff4e] opacity-0 hover:opacity-100 rounded-lg transition-ease-300 cursor-pointer z-10"
                    >
                      <PencilSimple size={20} weight="bold" /> Edit Cover
                    </div>
                  </>
                )}
                {project.images && project.images.length > 1 ? (
                  <Carousel
                    className="w-full"
                    opts={{
                      align: 'center',
                      loop: true,
                      dragFree: false,
                      duration: 2,
                      active: true,
                    }}
                  >
                    <CarouselContent>
                      {project.images.map((image, index) => {
                        let imageHash = 'no-hash';
                        if (project.hashes && index < project.hashes.length) imageHash = project.hashes[index];
                        return (
                          <CarouselItem key={image}>
                            <Image
                              crossOrigin="anonymous"
                              width={1920}
                              height={1080}
                              className="w-full rounded-lg"
                              alt={'Project Pic'}
                              src={`${PROJECT_PIC_URL}/${image}`}
                              placeholder="blur"
                              blurDataURL={imageHash}
                            />
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                  </Carousel>
                ) : (
                  <Image
                    crossOrigin="anonymous"
                    className="w-full rounded-lg"
                    src={getProjectPicURL(project)}
                    alt="Project Cover"
                    width={1920}
                    height={1080}
                    placeholder="blur"
                    blurDataURL={getProjectPicHash(project)}
                  />
                )}
              </div>
              <div className="w-full flex flex-col gap-4">
                <div className="w-full flex items-center justify-between">
                  <div className="w-fit font-bold text-4xl text-gradient">{project.title}</div>
                  <div className="flex-center gap-6">
                    {checkOrgProjectAccess(PROJECT_EDITOR, project.id, ORG_SENIOR, project.organization) && (
                      <EditProject project={project} setProject={setProject} />
                    )}
                    <LowerProject project={project} />
                  </div>
                </div>
                <div className="font-semibold text-lg">{project.tagline}</div>
                <Tags tags={project.tags} displayAll />
                <div className="whitespace-pre-line">
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
                <Links links={project.links} />
              </div>
              {project.id && <CommentProject project={project} />}
            </div>
          </PrimeWrapper>
        </div>
        <SideBarWrapper>
          <SidePrimeWrapper>
            <div className="w-full flex flex-col gap-2">
              <div className="text-lg font-medium">Project By</div>
              <UserSideCard user={project.user} />
            </div>
          </SidePrimeWrapper>
          <Collaborators project={project} setProject={setProject} />
          <Openings project={project} setProject={setProject} />
          {project.id && (
            <>
              {!checkProjectAccess(PROJECT_MEMBER, project.id) ? (
                <SimilarProjects slug={project.slug} />
              ) : (
                <>
                  <Activity project={project} />
                  <Tasks project={project} />
                </>
              )}
            </>
          )}
        </SideBarWrapper>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default ProjectComponent;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { slug } = context.query;

  return {
    props: { slug },
  };
}
