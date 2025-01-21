import React, { useState } from 'react';
import Input from '@/components/form/input';
import Tags from '@/components/form/tags';
import Links from '@/components/form/links';
import Time from '@/components/form/time';
import { Hackathon } from '@/types';

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
  setImage: (file: File | null) => void;
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
  setImage,
  isEditMode,
  onSave,
}) => {
  const [localTitle, setLocalTitle] = useState(title);
  const [localTagline, setLocalTagline] = useState(tagline);
  const [localLocation, setLocalLocation] = useState(location);
  const [localDescription, setLocalDescription] = useState(description);
  const [localTags, setLocalTags] = useState(tags);
  const [localLinks, setLocalLinks] = useState(links);
  const [localImage, setLocalImage] = useState<File | null>(null);

  const handleSave = () => {
    const updatedData: Partial<Hackathon> = {
      title: localTitle,
      tagline: localTagline,
      location: localLocation,
      description: localDescription,
      tags: localTags,
      links: localLinks,
    };

    if (localImage) {
      setImage(localImage);
    }

    onSave(updatedData);
  };

  return (
    <div className="w-full flex flex-col gap-8 max-lg:gap-4">
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

      {/* Image upload (if needed) */}
      <div className="mt-4">
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            const file = e.target.files ? e.target.files[0] : null;
            setLocalImage(file);
          }}
        />
      </div>

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
