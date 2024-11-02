import { EVENT_PIC_URL } from '@/config/routes';
import BookmarkComponent, { BookmarkConfig } from './bookmark';
import { EventBookmark } from '@/types';

interface Props {
  bookmark: EventBookmark;
  setBookmark: React.Dispatch<React.SetStateAction<EventBookmark>>;
  setClick: React.Dispatch<React.SetStateAction<boolean>>;
  handleEdit: (bookmarkID: string, title: string) => Promise<number>;
  handleDelete: (bookmarkID: string) => Promise<void>;
}

export const eventBookmarkConfig = {
  itemsKey: 'eventItems',
  itemIDKey: 'eventID',
  itemTitleKey: 'title',
  itemCountLabel: 'Event',
  getImageSrc: (item: any) => `${EVENT_PIC_URL}/${item.event.coverPic || ''}`,
  getBlurDataURL: () => 'no-hash',
};

const EventsBookmarkComponent = ({ bookmark, setClick, setBookmark, handleEdit, handleDelete }: Props) => (
  <BookmarkComponent
    bookmark={bookmark}
    setClick={setClick}
    setBookmark={setBookmark}
    handleEdit={handleEdit}
    handleDelete={handleDelete}
    config={eventBookmarkConfig as BookmarkConfig}
  />
);

export default EventsBookmarkComponent;
