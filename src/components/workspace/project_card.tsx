import React from 'react';
import { Project } from '@/types';
import Image from 'next/image';
import { PROJECT_PIC_URL } from '@/config/routes';
import { Eye, HeartStraight } from '@phosphor-icons/react';
import { getProjectPicHash, getProjectPicURL } from '@/utils/funcs/safe_extract';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import UserHoverCard from '../explore/user_hover_card';

interface Props {
  index: number;
  project: Project;
  setClickedOnProject: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedProjectIndex: React.Dispatch<React.SetStateAction<number>>;
}

const ProjectCard = ({ index, project, setClickedOnProject, setClickedProjectIndex }: Props) => {
  return (
    <div
      onClick={() => {
        if (setClickedOnProject) setClickedOnProject(true);
        if (setClickedProjectIndex) setClickedProjectIndex(index);
      }}
      className="w-full flex items-center gap-4 hover:bg-primary_comp_hover dark:hover:bg-dark_primary_comp_hover rounded-md p-2 cursor-pointer transition-ease-out-500 animate-fade_third"
    >
      {project.images && project.images.length > 1 ? (
        <Carousel
          className="w-1/5"
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
          className="w-1/5 rounded-lg"
          src={getProjectPicURL(project)}
          alt="Project Cover"
          width={100}
          height={100}
          placeholder="blur"
          blurDataURL={getProjectPicHash(project)}
        />
      )}

      <div className="w-4/5 flex items-center justify-between text-white">
        <div className="grow">
          <div className="text-lg font-medium line-clamp-1">{project.title}</div>
          <div className="text-sm line-clamp-1">{project.tagline}</div>
          <div className="w-full flex gap-1 mt-2 text-xs line-clamp-1">
            By{' '}
            <UserHoverCard
              trigger={<div className="hover:underline underline-offset-2">{project.user.name}</div>}
              user={project.user}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs">
            <HeartStraight size={20} />
            <div>{project.noLikes}</div>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Eye size={20} />
            <div>{project.noImpressions}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
