import { Event } from '@/types';
import React from 'react';
import Share from './share';

interface Props {
  event: Event;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShareEvent = ({ event, setShow }: Props) => {
  return (
    <Share
      itemID={event.id}
      itemType="event"
      setShow={setShow}
      clipboardURL={`/explore/event/${event.id}`}
      item={<></>}
    />
  );
};

export default ShareEvent;
