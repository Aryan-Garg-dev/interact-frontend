import BookmarkComponent, { BookmarkConfig } from './bookmark';
import { PostBookmark } from '@/types';
import { POST_PIC_URL } from '@/config/routes';

interface Props {
  bookmark: PostBookmark;
  setBookmark: React.Dispatch<React.SetStateAction<PostBookmark>>;
  setClick: React.Dispatch<React.SetStateAction<boolean>>;
  handleEdit: (bookmarkID: string, title: string) => Promise<number>;
  handleDelete: (bookmarkID: string) => Promise<void>;
}

const postBookmarkConfig = {
  itemsKey: 'postItems',
  itemIDKey: 'postID',
  itemTitleKey: 'title',
  itemCountLabel: 'Post',
  getImageSrc: (item: any) => `${POST_PIC_URL}/${item.post.images?.[0] || ''}`,
  getBlurDataURL: () => 'no-hash',
};

const PostBookmarkComponent = ({ bookmark, setClick, setBookmark, handleEdit, handleDelete }: Props) => (
  <BookmarkComponent
    bookmark={bookmark}
    setClick={setClick}
    setBookmark={setBookmark}
    handleEdit={handleEdit}
    handleDelete={handleDelete}
    config={postBookmarkConfig as BookmarkConfig}
  />
);

export default PostBookmarkComponent;
