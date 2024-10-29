import PrimaryButton from '@/components/buttons/primary_btn';
import Checkbox from '@/components/form/checkbox';
import Input from '@/components/form/input';
import Links from '@/components/form/links';
import Select from '@/components/form/select';
import Tags from '@/components/form/tags';
import TextArea from '@/components/form/textarea';
import { SERVER_ERROR } from '@/config/errors';
import { ORG_URL, PROJECT_URL } from '@/config/routes';
import patchHandler from '@/handlers/patch_handler';
import { currentOrgIDSelector } from '@/slices/orgSlice';
import { userSelector } from '@/slices/userSlice';
import { Project } from '@/types';
import categories from '@/utils/categories';
import Toaster from '@/utils/toaster';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  projectToEdit: Project;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setProjectToEdit?: React.Dispatch<React.SetStateAction<Project>>;
  setProjects?: React.Dispatch<React.SetStateAction<Project[]>>;
  org?: boolean;
}

const EditProject = ({ projectToEdit, setShow, setProjectToEdit, setProjects, org = false }: Props) => {
  const [description, setDescription] = useState(projectToEdit.description);
  const [tagline, setTagline] = useState(projectToEdit.tagline);
  const [isPrivate, setIsPrivate] = useState(projectToEdit.isPrivate);
  const [category, setCategory] = useState(projectToEdit.category);
  const [tags, setTags] = useState<string[]>(projectToEdit.tags || []);
  const [links, setLinks] = useState<string[]>(projectToEdit.links || []);
  const [privateLinks, setPrivateLinks] = useState<string[]>(projectToEdit.privateLinks || []);
  const [image, setImage] = useState<File>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [mutex, setMutex] = useState(false);

  const user = useSelector(userSelector);

  const currentOrgID = useSelector(currentOrgIDSelector);

  const handleSubmit = async () => {
    if (description.trim() == '') {
      Toaster.error('Enter Description');
      return;
    }
    if (category.trim() == '') {
      Toaster.error('Select Category');
      return;
    }
    if (category == 'Select Category') {
      Toaster.error('Select Category');
      return;
    }
    if (tags.length == 0) {
      Toaster.error('Tags cannot be empty');
      return;
    }

    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Editing your project...');

    const formData = new FormData();

    if (tagline != projectToEdit.tagline) formData.append('tagline', tagline);
    if (description != projectToEdit.description) formData.append('description', description);
    // if (isArrEdited(tags, projectToEdit.tags))
    tags?.forEach(tag => formData.append('tags', tag));
    // if (isArrEdited(links, projectToEdit.links))
    links?.forEach(link => formData.append('links', link));
    // if (isArrEdited(privateLinks, projectToEdit.privateLinks))
    privateLinks?.forEach(link => formData.append('privateLinks', link));
    if (category != projectToEdit.category) formData.append('category', category);
    formData.append('isPrivate', String(isPrivate));
    if (image) formData.append('coverPic', image);

    const URL = org
      ? `${ORG_URL}/${currentOrgID}/projects/${projectToEdit.slug}`
      : `${PROJECT_URL}/${projectToEdit.slug}`;

    const res = await patchHandler(URL, formData, 'multipart/form-data');

    if (res.statusCode === 200) {
      const newProject = res.data.project;
      newProject.user = user;
      if (setProjects)
        setProjects(prev =>
          prev.map(project => {
            if (project.id == projectToEdit.id) {
              return newProject;
            } else return project;
          })
        );
      if (setProjectToEdit) {
        setProjectToEdit(prev => {
          return {
            ...prev,
            description,
            tagline,
            tags,
            links,
            privateLinks,
            category,
            isPrivate,
          };
        });
      }
      Toaster.stopLoad(toaster, 'Project Edited', 1);
      setTagline('');
      setDescription('');
      setTags([]);
      setLinks([]);
      setImage(undefined);
      setShow(false);
    } else if (res.statusCode == 413) Toaster.stopLoad(toaster, 'Image too large', 0);
    else if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
    else Toaster.stopLoad(toaster, SERVER_ERROR, 0);

    setMutex(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Edit Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md min-w-[40%]">
        <DialogHeader>
          <DialogTitle className="text-3xl">Edit Project</DialogTitle>
        </DialogHeader>
        <div className="w-full h-fit flex flex-col max-lg:items-center gap-4 max-lg:gap-6 max-lg:pb-4">
          <Select label="Project Category" val={category} setVal={setCategory} options={categories} required={true} />
          <Input label="Project Tagline" val={tagline} setVal={setTagline} maxLength={50} required={true} />
          <TextArea label="Project Description" val={description} setVal={setDescription} maxLength={1000} />
          <Tags label="Project Tags" tags={tags} setTags={setTags} maxTags={10} required={true} />
          <Links label="Project Links" links={links} setLinks={setLinks} maxLinks={5} />
          <Checkbox label="Keep this Project Private" val={isPrivate} setVal={setIsPrivate} />
          {/* <div className="w-full flex max-lg:justify-center justify-end">
            <PrimaryButton label="Edit Project" onClick={handleSubmit} width="40" />
          </div> */}
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

export default EditProject;
