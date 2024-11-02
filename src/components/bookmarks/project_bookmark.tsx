import BookmarkComponent, { BookmarkConfig } from './bookmark';
import { ProjectBookmark } from '@/types';
import { getProjectPicHash, getProjectPicURL } from '@/utils/funcs/safe_extract';
import React, { Dispatch, SetStateAction } from 'react';

interface ProjectBookmarkProps {
  bookmark: ProjectBookmark;
  setClick: Dispatch<SetStateAction<boolean>>;
  setBookmark: Dispatch<SetStateAction<ProjectBookmark>>;
  handleEdit: (bookmarkID: string, title: string) => Promise<number>;
  handleDelete: (bookmarkID: string) => Promise<void>;
}

const projectBookmarkConfig = {
  itemsKey: 'projectItems',
  itemIDKey: 'projectID',
  itemTitleKey: 'title',
  itemCountLabel: 'Project',
  getImageSrc: (item: any) => getProjectPicURL(item.project),
  getBlurDataURL: (item: any) => getProjectPicHash(item.project),
};

const ProjectBookmarkContainer = ({
  bookmark,
  setClick,
  setBookmark,
  handleEdit,
  handleDelete,
}: ProjectBookmarkProps) => (
  <BookmarkComponent
    bookmark={bookmark}
    setClick={setClick}
    setBookmark={setBookmark}
    handleEdit={handleEdit}
    handleDelete={handleDelete}
    config={projectBookmarkConfig as BookmarkConfig}
  />
);

export default ProjectBookmarkContainer;
