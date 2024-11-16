import { PROJECT_PIC_URL } from '@/config/routes';
import { Project } from '@/types';

export default function SafeExtractArray(obj: any) {
  if (obj == undefined) return [];
  else return obj;
}

export const getProjectPicURL = (project?: Project | null): string => {
  if (!project || !project.images || project.images.length == 0) return `${PROJECT_PIC_URL}/default.jpg`;

  return `${PROJECT_PIC_URL}/${project.images[0]}`;
};

export const getProjectPicHash = (project?: Project | null): string => {
  if (!project || !project.hashes || project.hashes.length == 0) return 'no-hash';

  return project.hashes[0];
};
