import Input from '@/components/form/input';
import Select from '@/components/form/select';
import Tags from '@/components/form/tags';
import TextArea from '@/components/form/textarea';
import { Button } from '@/components/ui/button';
import { SERVER_ERROR } from '@/config/errors';
import { COMMUNITY_URL } from '@/config/routes';
import patchHandler from '@/handlers/patch_handler';
import { Community } from '@/types';
import categories from '@/utils/categories';
import Toaster from '@/utils/toaster';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import React, { useState } from 'react';
import isArrEdited from '@/utils/funcs/check_array_edited';

const EditCommunity = ({
  community,
  setCommunity,
}: {
  community: Community;
  setCommunity: React.Dispatch<React.SetStateAction<Community>>;
}) => {
  const [title, setTitle] = useState(community.title);
  const [description, setDescription] = useState(community.description || '');
  const [tagline, setTagline] = useState(community.tagline);
  const [category, setCategory] = useState(community.category);
  const [access, setAccess] = useState(community.access);
  const [tags, setTags] = useState(community.tags);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async () => {
    if (title.trim() === '') {
      Toaster.error('Title cannot be empty');
      return;
    }
    if (category.trim() === '' || category === 'Select Category') {
      Toaster.error('Select Category');
      return;
    }

    const toaster = Toaster.startLoad('Editing the community...');

    const formData = new FormData();
    if (title != community.title) formData.append('title', title);
    if (description != community.description) formData.append('description', description);
    if (tagline != community.tagline) formData.append('tagline', tagline);
    if (isArrEdited(tags, community.tags, true)) tags.forEach(tag => formData.append('tags', tag));
    if (category != community.category) formData.append('category', category);
    if (access != community.access) formData.append('access', access);

    const URL = `${COMMUNITY_URL}/${community.id}`;

    const res = await patchHandler(URL, formData, 'multipart/form-data');
    if (res.statusCode === 200) {
      if (setCommunity)
        setCommunity(prev => {
          return { ...prev, title, tagline, description, tags, category, access };
        });
      Toaster.stopLoad(toaster, 'Community Edited', 1);
      setIsDialogOpen(false);
    } else if (res.statusCode === 413) {
      Toaster.stopLoad(toaster, 'Image too large', 0);
    } else {
      if (res.data.message) {
        Toaster.stopLoad(toaster, res.data.message, 0);
      } else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Edit Community
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md min-w-[30%]">
        <DialogHeader>
          <DialogTitle className="text-3xl">Edit Community</DialogTitle>
          <DialogDescription>Create your own niche and gather like-minded people.</DialogDescription>
        </DialogHeader>
        <div className="w-full max-lg:w-full text-primary_black flex flex-col gap-4 pb-8 max-lg:pb-4">
          <Input label="Community Name" val={title} setVal={setTitle} maxLength={25} type="text" required />
          <Input label="Community Tagline" val={tagline} setVal={setTagline} maxLength={100} type="text" required />
          <Select label="Community Category" val={category} setVal={setCategory} options={categories} required />
          <div className="flex flex-col gap-1">
            <Select
              label="Community Access"
              val={access}
              setVal={setAccess}
              options={['Open', 'Restricted', 'Closed']}
              required
            />
            <div className="text-xs text-gray-400">
              {access === 'open'
                ? "Anyone can see community's posts and join."
                : access === 'restricted'
                ? 'Community join and post seeing on request basis.'
                : 'No one can either join your community or see its posts.'}
            </div>
          </div>
          <TextArea label="Community Description" val={description} setVal={setDescription} maxLength={1000} />
          <Tags label="Community Tags" tags={tags} setTags={setTags} maxTags={10} />
        </div>
        <DialogFooter className="w-full flex-center">
          <Button onClick={handleSubmit} type="button" variant="outline" className="w-1/2">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCommunity;
