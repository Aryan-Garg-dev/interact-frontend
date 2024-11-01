import React from 'react';
import { Opening, Project } from '@/types';
import Link from 'next/link';
import OpeningBookmarkIcon from '../../components/lowers/opening_bookmark';
import moment from 'moment';
import { SidePrimeWrapper } from '@/wrappers/side';

interface Props {
  project: Project;
}

const Openings = ({ project }: Props) => {
  return project.openings && project.openings.length > 0 ? (
    <SidePrimeWrapper>
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex items-center justify-between">
          <div className="text-lg font-medium">Active Openings</div>
          <Link href={`/explore?pid=${project.slug}&tab=openings`} target="_blank" className="text-xs">
            view all
          </Link>
        </div>
        <div
          className={`w-full flex flex-wrap ${
            project.openings.length == 1 ? 'justify-start' : 'justify-evenly'
          } max-lg:grid max-lg:grid-cols-3 max-md:flex max-md:justify-center gap-2`}
        >
          {project.openings.map(opening => {
            return (
              <Link
                key={opening.id}
                href={`/explore?pid=${project.slug}&tab=openings`}
                target="_blank"
                className="w-full relative border-[1px] border-gray-500 dark:border-dark_primary_btn p-3 flex flex-col gap-2 rounded-md dark:hover:bg-dark_primary_comp_hover transition-ease-300"
              >
                <div className="w-full flex items-center justify-between">
                  <div className="text-lg font-semibold line-clamp-2">{opening.title}</div>
                  <div className="text-xs">{moment(opening.createdAt).fromNow()}</div>

                  {/* <div
                  onClick={el => {
                    el.preventDefault();
                    el.stopPropagation();
                  }}
                  className="z-20"
                >
                  <OpeningBookmarkIcon opening={opening} />
                </div> */}
                </div>
                <div className="w-full text-sm line-clamp-2">{opening.description}</div>
              </Link>
            );
          })}
          {project.openings.length > 5 && (
            <Link
              href={`/explore?pid=${project.slug}&tab=openings`}
              target="_blank"
              className="w-full relative border-[1px] text-primary_black border-gray-500 p-4 flex-center flex-col gap-2 rounded-md hover:shadow-2xl transition-ease-300"
            >
              <div className="border-2 border-dashed border-gray-500 text-lg rounded-full w-12 h-12 flex-center font-semibold">
                +{project.openings.length - 1}
              </div>
              <div className="text-sm">click here to view all</div>
            </Link>
          )}
        </div>
      </div>
    </SidePrimeWrapper>
  ) : (
    <></>
  );
};

export default Openings;
