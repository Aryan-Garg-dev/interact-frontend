import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SidePrimeWrapper } from '@/wrappers/side';
import Select from '@/components/form/select';
import Input from '@/components/form/input';
import TextArea from '@/components/form/textarea';
import Tags from '@/components/form/tags';
import categories from '@/utils/categories';
import Toaster from '@/utils/toaster';
import postHandler from '@/handlers/post_handler';
import { COMMUNITY_URL } from '@/config/routes';
import { Community } from '@/types';
import { SERVER_ERROR } from '@/config/errors';
import { useDispatch } from 'react-redux';
import { setCommunityMemberships, userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';
import getHandler from '@/handlers/get_handler';

const CommunitySide = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [ownedCommunities, setOwnedCommunities] = useState<Community[]>([]);

  const fetchCommunities = async (communityType: 'joined' | 'owned') => {
    const URL = `${COMMUNITY_URL}/me?communityType=${communityType}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      const communityData = res.data.communities || [];
      if (communityType == 'joined') setCommunities(communityData);
      else setOwnedCommunities(communityData);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  useEffect(() => {
    fetchCommunities('joined');
    fetchCommunities('owned');
  }, []);

  return (
    <>
      <SidePrimeWrapper>
        <CreateCommunity setCommunities={setOwnedCommunities} />
      </SidePrimeWrapper>
      {ownedCommunities && ownedCommunities.length > 0 && (
        <SidePrimeWrapper title="Owned Communities">
          <div className="w-full flex flex-col gap-2">
            {ownedCommunities.map(community => (
              <div key={community.id}>hello</div>
            ))}
          </div>
        </SidePrimeWrapper>
      )}
      {communities && communities.length > 0 && (
        <SidePrimeWrapper title="Joined Communities">
          <div className="w-full flex flex-col gap-2">
            {communities.map(community => (
              <div key={community.id}></div>
            ))}
          </div>
        </SidePrimeWrapper>
      )}
    </>
  );
};

const CreateCommunity = ({ setCommunities }: { setCommunities: React.Dispatch<React.SetStateAction<Community[]>> }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('');
  const [access, setAccess] = useState('Open');
  const [tags, setTags] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const user = useSelector(userSelector);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (title.trim() === '') {
      Toaster.error('Title cannot be empty');
      return;
    }
    if (category.trim() === '' || category === 'Select Category') {
      Toaster.error('Select Category');
      return;
    }

    const toaster = Toaster.startLoad('Creating your community...');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tagline', tagline);
    tags.forEach(tag => formData.append('tags', tag));
    formData.append('category', category);
    formData.append('access', access);

    const res = await postHandler(COMMUNITY_URL, formData, 'multipart/form-data');

    if (res.statusCode === 201) {
      const community = res.data.community;
      const membership = res.data.membership;
      if (setCommunities) setCommunities(prev => [community, ...prev]);
      Toaster.stopLoad(toaster, 'Community Created!', 1);
      setTitle('');
      setDescription('');
      setTagline('');
      setTags([]);
      setCategory('');
      setAccess('Open');
      dispatch(setCommunityMemberships([...(user.communityMemberships || []), membership]));
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
          Create your Community
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md min-w-[30%]">
        <DialogHeader>
          <DialogTitle className="text-3xl">Create Community</DialogTitle>
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
              {access === 'Open'
                ? "Anyone can see community's posts and join."
                : access === 'Restricted'
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

export default CommunitySide;
