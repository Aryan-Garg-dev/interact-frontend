import { Project } from '@/types';
import { getProjectPicHash, getProjectPicURL } from '@/utils/funcs/safe_extract';
import { Buildings, HeartStraight, Eye } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  project: Project;
}

const ProjectCard = ({ project }: Props) => (
  <Link
    href={`projects/${project.slug}&action=external`}
    target="_blank"
    className="relative w-full rounded-lg group transition-ease-out-500 animate-fade_third"
    style={{ paddingTop: '100%' }}
  >
    <div className="w-full h-full rounded-lg overflow-clip p-4 text-sm backdrop-blur-xl text-white absolute top-0 left-0 bg-gradient-to-b from-[#00000080] z-[5] to-transparent opacity-0 group-hover:opacity-100 transition-ease-300"></div>
    <div className="w-full h-full flex flex-col gap-2 rounded-lg overflow-clip p-4 text-sm fade-img backdrop-blur-sm text-white absolute top-0 left-0 z-[5] opacity-0 group-hover:opacity-100 transition-ease-300">
      <div className="font-bold">{project.tagline}</div>
      <div className="flex flex-wrap gap-2">
        {project.tags?.map(tag => (
          <div
            key={tag}
            className="flex-center px-2 py-1 border-[1px] border-dashed border-gray-400 text-xs rounded-lg"
          >
            {tag}
          </div>
        ))}
      </div>
      <div className="whitespace-pre-line">{project.description}</div>
    </div>
    <Image
      crossOrigin="anonymous"
      className="w-full h-full rounded-lg object-cover absolute top-0 left-0 "
      src={getProjectPicURL(project)}
      alt="Project Cover"
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 40vw, 20vw"
      width={100}
      height={100}
      placeholder="blur"
      blurDataURL={getProjectPicHash(project)}
    />
    <div className="w-full glassMorphism text-white rounded-b-lg font-primary absolute bottom-0 right-0 flex flex-col px-4 py-2">
      <div className="line-clamp-1">{project.title}</div>
      <div className="w-full flex items-center justify-between">
        <div className="w-full flex items-center gap-1 line-clamp-1 text-xs">
          {project.user.name}{' '}
          {project.user.isOrganization ? (
            <Buildings />
          ) : (
            <div className="text-xs">
              {project.memberships?.length > 0 && (
                <>
                  + {project.memberships.length} other{project.memberships.length == 1 ? '' : 's'}
                </>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs">
            <HeartStraight size={16} />
            <div>{project.noLikes}</div>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Eye size={16} />
            <div>{project.noImpressions}</div>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default ProjectCard;
