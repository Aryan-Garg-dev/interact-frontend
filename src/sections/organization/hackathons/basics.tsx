import React, { useState } from 'react';
import Input from '@/components/form/input';
import Tags from '@/components/form/tags';
import Links from '@/components/form/links';
import Time from '@/components/form/time';
import { Hackathon } from '@/types';
import { ImageSquare, PencilSimple, X } from '@phosphor-icons/react';
import { EVENT_PIC_URL } from '@/config/routes';
import { resizeImage } from '@/utils/resize_image';
import Toaster from '@/utils/toaster';
import Image from 'next/image';

interface BasicsProps {
  title: string;
  tagline: string;
  location: string;
  startTime: string;
  setStartTime: (val: string) => void;
  endTime: string;
  setEndTime: (val: string) => void;
  description: string;
  tags: string[];
  links: string[];
  coverPic?: string;
  setCoverPic: (file: File | null) => void;
  isEditMode: boolean;
  onSave: (updatedData: Partial<Hackathon>) => void;
}

const Basics: React.FC<BasicsProps> = ({
  title,
  tagline,
  location,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  description,
  tags,
  links,
  coverPic,
  setCoverPic,
  isEditMode,
  onSave,
}) => {
  const [localTitle, setLocalTitle] = useState(title);
  const [localTagline, setLocalTagline] = useState(tagline);
  const [localLocation, setLocalLocation] = useState(location);
  const [localDescription, setLocalDescription] = useState(description);
  const [localTags, setLocalTags] = useState(tags);
  const [localLinks, setLocalLinks] = useState(links);
  const [coverPicView, setCoverPicView] = useState(`${EVENT_PIC_URL}/${coverPic || 'default.jpg'}`);

  const handleSave = () => {
    const updatedData: Partial<Hackathon> = {
      title: localTitle,
      tagline: localTagline,
      location: localLocation,
      description: localDescription,
      tags: localTags,
      links: localLinks,
    };

    onSave(updatedData);
  };

  return (
    <div className="w-full flex flex-col gap-8 max-lg:gap-4">
      <div className="w-full relative group">
        <input
          type="file"
          className="hidden"
          id="coverPic"
          multiple={false}
          onChange={async ({ target }) => {
            if (target.files && target.files[0]) {
              const file = target.files[0];
              if (file.type.split('/')[0] == 'image') {
                const resizedPic = await resizeImage(file, 1920, 720);
                setCoverPicView(URL.createObjectURL(resizedPic));
                setCoverPic(resizedPic);
              } else Toaster.error('Only Image Files can be selected');
            }
          }}
        />
        <div className="w-full h-full relative group">
          <label
            htmlFor="coverPic"
            className="w-full h-full absolute top-0 right-0 rounded-lg z-10 flex-center bg-white transition-ease-200 cursor-pointer bg-[#ffffff00] hover:bg-[#ffffff30]"
          >
            <PencilSimple className="opacity-0 group-hover:opacity-100 transition-ease-200" size={32} />
          </label>
          <Image
            crossOrigin="anonymous"
            className="w-full rounded-lg"
            src={coverPicView}
            alt="Event Cover"
            width={1920}
            height={720}
          />
        </div>
      </div>
      <Input label="Title" val={localTitle} setVal={setLocalTitle} maxLength={25} required={true} />
      <Input label="Tagline" val={localTagline} setVal={setLocalTagline} maxLength={50} required={true} />
      <Input label="Location" val={localLocation} setVal={setLocalLocation} maxLength={25} placeholder="Online" />
      <div className="w-full flex justify-between gap-4">
        <div className="w-1/2">
          <Time label="Start Time" val={startTime} setVal={setStartTime} required={true} includeDate={true} />
        </div>
        <div className="w-1/2">
          <Time label="End Time" val={endTime} setVal={setEndTime} required={true} includeDate={true} />
        </div>
      </div>
      <Input label="Description" val={localDescription} setVal={setLocalDescription} maxLength={2500} />
      <Tags label="Tags" tags={localTags} setTags={setLocalTags} maxTags={10} required={true} />
      <Links label="Links" links={localLinks} setLinks={setLocalLinks} maxLinks={5} />

      {isEditMode && (
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2 w-fit"
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default Basics;
