import React from 'react';
import Input from '@/components/form/input';
import TextArea from '@/components/form/textarea';
import Tags from '@/components/form/tags';
import Links from '@/components/form/links';
import Time from '@/components/form/time';
import moment from 'moment';

interface BasicsProps {
  title: string;
  setTitle: (value: string) => void;
  tagline: string;
  setTagline: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  startTime: Date;
  setStartTime: (value: Date) => void;
  endTime: Date;
  setEndTime: (value: Date) => void;
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
  const formatDateTime = (value: string) => {
    const date = new Date(value);
    return moment(date).format('YYYY-MM-DDTHH:mm');
  };

  // Handle adding a new link
  const handleAddLink = (newLink: string) => {
    if (newLink && !links.includes(newLink)) {
      setLinks([...links, newLink]);
    }
  };

  // Handle deleting a link
  const handleDeleteLink = (linkToDelete: string) => {
    setLinks(links.filter(link => link !== linkToDelete));
  };

  // Handle editing a link
  const handleEditLink = (index: number, updatedLink: string) => {
    const updatedLinks = [...links];
    updatedLinks[index] = updatedLink;
    setLinks(updatedLinks);
  };

  // Handle adding a new tag
  const handleAddTag = (newTag: string) => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
  };

  // Handle deleting a tag
  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  return (
    <div className="w-full flex flex-col gap-8 max-lg:gap-4">
      <Input label="Title" val={title} setVal={setTitle} maxLength={25} required={true} />
      <Input label="Tagline" val={tagline} setVal={setTagline} maxLength={50} required={true} />
      <Input label="Location" val={location} setVal={setLocation} maxLength={25} placeholder="Online" />

      {/* Start and End Time */}
      <div className="w-full flex justify-between gap-4">
        <div className="w-1/2">
          <Time
            label="Start Time"
            val={formatDateTime(startTime)}
            setVal={setStartTime}
            required={true}
            includeDate={true}
          />
        </div>
        <div className="w-1/2">
          <Time label="End Time" val={formatDateTime(endTime)} setVal={setEndTime} required={true} includeDate={true} />
        </div>
      </div>

      {/* Description */}
      <Input label="Description" val={description} setVal={setDescription} maxLength={2500} />

      {/* Tags Management */}
      <Tags
        label="Tags"
        tags={tags}
        setTags={setTags}
        maxTags={10}
        required={true}
        onAddTag={handleAddTag}
        onDeleteTag={handleDeleteTag}
      />

      {/* Links Management */}
      <Links
        label="Links"
        links={links}
        setLinks={setLinks}
        maxLinks={5}
        onAddLink={handleAddLink}
        onDeleteLink={handleDeleteLink}
        onEditLink={handleEditLink}
      />

      {/* Image upload (if needed) */}
      <div className="mt-4">
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files ? e.target.files[0] : null)} />
      </div>
    </div>
  );
};

export default Basics;
