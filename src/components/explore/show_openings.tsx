import React from 'react';
import { Opening, Project } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { PROJECT_PIC_URL } from '@/config/routes';
import OpeningBookmarkIcon from '../lowers/opening_bookmark';

interface Props {
  openings: Opening[];
  slug: string;
  projectCoverPic: string;
}

const Openings = ({ openings, slug, projectCoverPic }: Props) => {
  return (
    <>
      {openings && openings.length > 0 ? (
        <div className="w-full flex flex-col gap-2">
          <div className="text-lg font-semibold">Open Positions</div>
          <div
            className={`w-full flex flex-wrap ${
              openings.length == 1 ? 'justify-start' : 'justify-evenly'
            } max-lg:grid max-lg:grid-cols-3 max-md:flex max-md:justify-center gap-2`}
          >
            {openings
              .filter((opening, index) => {
                return index >= 0 && index < 5;
              })
              .map(opening => {
                return (
                  <Link
                    key={opening.id}
                    href={`/explore?pid=${slug}&tab=openings`}
                    target="_blank"
                    className="w-64 relative border-[1px] border-gray-500 p-4 flex flex-col gap-2 rounded-md hover:shadow-2xl transition-ease-300"
                  >
                    <div className="w-full flex flex-wrap justify-between items-center">
                      <div className="w-4/5 text-2xl font-semibold line-clamp-2">{opening.title}</div>
                      <div
                        onClick={el => {
                          el.preventDefault();
                          el.stopPropagation();
                        }}
                        className="z-20"
                      >
                        <OpeningBookmarkIcon opening={opening} />
                      </div>
                    </div>
                    <div className="w-full flex flex-wrap gap-2">
                      {opening.tags
                        .filter((_, i) => {
                          return i > 0 && i < 3;
                        })
                        .map((el, i) => (
                          <div key={i} className="text-xs text-gray-900 border-[1px] rounded-md flex-center p-1">
                            {el}
                          </div>
                        ))}
                      {opening.tags.length > 3 ? (
                        <div className="text-xs text-gray-900 border-[1px] rounded-md flex-center p-1">
                          + {opening.tags.length - 3}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="w-full text-gray-700 text-sm line-clamp-3">{opening.description}</div>
                    <Image
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover absolute top-0 right-0 opacity-30 blur-[1px]"
                      src={`${PROJECT_PIC_URL}/${projectCoverPic}`}
                      alt="Project Cover"
                      width={200}
                      height={200}
                    />
                  </Link>
                );
              })}
            {openings.length > 5 ? (
              <Link
                href={`/explore?pid=${slug}&tab=openings`}
                target="_blank"
                className="w-64 relative border-[1px] text-primary_black border-gray-500 p-4 flex-center flex-col gap-2 rounded-md hover:shadow-2xl transition-ease-300"
              >
                <div className="border-2 border-dashed border-gray-500 text-lg rounded-full w-12 h-12 flex-center font-semibold">
                  +{openings.length - 1}
                </div>
                <div className="text-sm">click here to view all</div>
                <Image
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover absolute top-0 right-0 opacity-30 blur-[1px]"
                  src={`${PROJECT_PIC_URL}/${projectCoverPic}`}
                  alt="Project Cover"
                  width={500}
                  height={500}
                />
              </Link>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Openings;
