import React, { ReactNode } from 'react';
import { Project } from '@/types';
import { Eye, HeartStraight } from '@phosphor-icons/react';
import Link from 'next/link';
import UserHoverCard from './user_hover_card';
import ProjectCardCarousel from './project_card_carousel';

interface Props {
  index?: number;
  project: Project;
  setClickedProject?: React.Dispatch<React.SetStateAction<Project | null>>;
  isLink?: boolean;
  smaller?: boolean;
}

const ProjectCard = ({ project, setClickedProject, isLink = false, smaller = false }: Props) => {
  const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) =>
    isLink ? (
      <Link
        href={`/projects/${project.slug}`}
        className={`w-full flex items-center ${
          smaller ? 'gap-2' : 'gap-4'
        } hover:bg-primary_comp_hover dark:hover:bg-dark_primary_comp_active rounded-md p-2 transition-ease-out-500 animate-fade_third`}
      >
        {children}
      </Link>
    ) : (
      <div
        onClick={() => {
          if (setClickedProject) setClickedProject(project);
        }}
        className={`w-full flex items-center ${
          smaller ? 'gap-2' : 'gap-4'
        } hover:bg-primary_comp_hover dark:hover:bg-dark_primary_comp_hover rounded-md p-2 cursor-pointer transition-ease-out-500 animate-fade_third`}
      >
        {children}
      </div>
    );

  return (
    <Wrapper>
      <ProjectCardCarousel project={project} width="1/5" />
      <div className="w-4/5 flex items-center justify-between dark:text-white">
        <div className="grow">
          <div className={`${!smaller && 'text-lg'} font-medium line-clamp-1`}>{project.title}</div>
          <div className="text-sm line-clamp-1">{project.tagline}</div>
          {!smaller && (
            <div className="w-full flex gap-1 mt-2 text-xs line-clamp-1">
              By{' '}
              <UserHoverCard
                trigger={<div className="hover:underline underline-offset-2">{project.user.name}</div>}
                user={project.user}
              />
            </div>
          )}
        </div>
        {!smaller && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 text-xs">
              <HeartStraight size={20} />
              <div>{project.noLikes}</div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Eye size={20} />
              <div>{project.noImpressions}</div>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default React.memo(ProjectCard);
