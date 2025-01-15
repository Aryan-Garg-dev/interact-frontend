import React from 'react';
import Input from '@/components/form/input';
import TextArea from '@/components/form/textarea';
import Tags from '@/components/form/tags';
import Links from '@/components/form/links';
import Time from '@/components/form/time';

interface BasicsProps {
  title: string;
  setTitle: (value: string) => void;
  tagline: string;
  setTagline: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  tags: string[];
  setTags: (value: string[]) => void;
  links: string[];
  setLinks: (value: string[]) => void;
  setImage: (file: File | null) => void;
}

const Basics: React.FC<BasicsProps> = ({
  title,
  setTitle,
  tagline,
  setTagline,
  location,
  setLocation,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  description,
  setDescription,
  tags,
  setTags,
  links,
  setLinks,
  setImage,
}) => {
  return (
    <div className="w-full flex flex-col gap-8 max-lg:gap-4">
      <Input label="Title" val={title} setVal={setTitle} maxLength={25} required={true} />
      <Input label="Tagline" val={tagline} setVal={setTagline} maxLength={50} required={true} />
      <Input label="Location" val={location} setVal={setLocation} maxLength={25} placeholder="Online" />
      <div className="w-full flex justify-between gap-4">
        <div className="w-1/2">
          <Time label="Start Time" val={startTime} setVal={setStartTime} required={true} />
        </div>
        <div className="w-1/2">
          <Time label="End Time" val={endTime} setVal={setEndTime} required={true} />
        </div>
      </div>
      <TextArea label="Description" val={description} setVal={setDescription} maxLength={2500} />
      <Tags label="Tags" tags={tags} setTags={setTags} maxTags={10} required={true} />
      <Links label="Links" links={links} setLinks={setLinks} maxLinks={5} />
    </div>
  );
};
export default Basics;
