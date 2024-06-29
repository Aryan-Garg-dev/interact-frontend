import { ResourceBucket } from '@/types';
import checkOrgAccess from '@/utils/funcs/check_org_access';
import { Lock } from '@phosphor-icons/react';
import React from 'react';

interface Props {
  resource: ResourceBucket;
  setClickedOnResource?: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedResource?: React.Dispatch<React.SetStateAction<ResourceBucket>>;
}

const ResourceCard = ({ resource, setClickedOnResource, setClickedResource }: Props) => {
  return (
    <div
      onClick={() => {
        if (setClickedOnResource) setClickedOnResource(true);
        if (setClickedResource) setClickedResource(resource);
      }}
      className={`w-72 bg-white relative flex flex-col items-center gap-2 rounded-lg px-6 py-8 border-gray-400 border-[1px] ${
        checkOrgAccess(resource.viewAccess) ? 'cursor-pointer hover:shadow-xl' : 'cursor-default'
      } transition-ease-300`}
    >
      {!checkOrgAccess(resource.viewAccess) && <Lock className="absolute top-4 right-4" size={24} />}

      <div className="w-24 h-24 flex-center flex-col items-center border-dark_primary_btn border-[5px] rounded-full">
        <div className="text-5xl max-md:text-2xl font-bold text-gradient">{resource.noFiles}</div>
        <div className="w-40 text-center">File{resource.noFiles != 1 ? 's' : ''}</div>
      </div>
      <div className="w-full flex flex-col items-center text-center gap-1">
        <div className="font-semibold text-3xl line-clamp-1">{resource.title}</div>
        <div className="text-sm text-gray-600 line-clamp-2">{resource.description}</div>
      </div>
    </div>
  );
};

export default ResourceCard;
