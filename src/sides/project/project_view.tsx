import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { Project } from '@/types';
import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Buildings } from '@phosphor-icons/react';
import Link from 'next/link';
import Links from '@/components/explore/show_links';
import renderContentWithLinks from '@/utils/funcs/render_content_with_links';
import { SidePrimeWrapper } from '@/wrappers/side';
import { getProjectPicHash, getProjectPicURL } from '@/utils/funcs/safe_extract';
import { PROJECT_PIC_URL } from '@/config/routes';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import LowerProject from '@/components/lowers/lower_project';
import { Button } from '@/components/ui/button';

interface Props {
  project: Project;
}

const ProjectView = ({ project }: Props) => {
  const [clickedOnReadMore, setClickedOnReadMore] = useState(false);

  return (
    <SidePrimeWrapper stickTop>
      <div className="w-full max-h-base_md overflow-y-auto flex flex-col gap-4 dark:text-white font-primary">
        <div className="w-full flex gap-2 max-lg:gap-4">
          <Image
            crossOrigin="anonymous"
            width={100}
            height={100}
            alt={'User Pic'}
            src={`${USER_PROFILE_PIC_URL}/${project.user.profilePic}`}
            placeholder="blur"
            blurDataURL={project.user.profilePicBlurHash || 'no-hash'}
            className="w-10 h-10 rounded-full"
          />
          <div className="w-[calc(100%-40px)]">
            <div className="w-fit font-bold cursor-default line-clamp-1">{project.title}</div>
            <div className="w-fit flex items-center gap-1 text-xs font-medium">
              <div
                onClick={() =>
                  window.location.assign(
                    `/${project.user.isOrganization ? 'organisations' : 'users'}/${project.user.username}`
                  )
                }
                className="cursor-pointer hover-underline-animation after:bg-black dark:after:bg-white"
              >
                {project.user.name}
              </div>
              {project.user.isOrganization ? (
                <Buildings />
              ) : (
                project.noMembers > 1 && <div className="flex-center">+ {project.noMembers} others</div>
              )}
            </div>
          </div>
        </div>
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
                      width={430}
                      height={270}
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
            width={430}
            height={270}
            placeholder="blur"
            blurDataURL={getProjectPicHash(project)}
          />
        )}

        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="font-bold text-3xl text-gradient">{project.title}</div>
            <LowerProject project={project} />
          </div>
          <div className="font-semibold text-lg">{project.tagline}</div>

          <div className="text-sm whitespace-pre-line">
            {project.description.length > 200 ? (
              clickedOnReadMore ? (
                project.description
              ) : (
                <>
                  {project.description.substring(0, 200)}
                  <span onClick={() => setClickedOnReadMore(true)} className="text-xs italic opacity-60 cursor-pointer">
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
                    href={`/projects?search=${tag}`}
                    target="_blank"
                    key={tag}
                    className="flex-center p-2 font-primary text-xs dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn bg-gray-200 dark:bg-dark_primary_comp rounded-lg"
                  >
                    {tag}
                  </Link>
                );
              })}
          </div>
          <Links links={project.links} />
          <Link
            href={`/projects/${project.slug}`}
            target="_blank"
            className="w-full flex-center py-2 bg-primary_comp dark:bg-dark_primary_comp_hover hover:bg-primary_comp_hover dark:hover:bg-dark_primary_comp_active rounded-lg transition-ease-300"
          >
            Open Project <ArrowUpRight size={20} weight="bold" />
          </Link>
        </div>
      </div>
    </SidePrimeWrapper>
  );
};

export default ProjectView;
