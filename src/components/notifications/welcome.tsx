import React from 'react';
import { Notification } from '@/types';
import NotificationWrapper from '@/wrappers/notification';

interface Props {
  notification: Notification;
}

const Welcome = ({ notification }: Props) => {
  const getMessage = () => {
    switch (notification.notificationType) {
      case -1:
        return "Woohoo! You made it to Interact 🎉🥳";
      default:
        return "Welcome to Interact";
    }
  };

  return (
    <NotificationWrapper notification={notification} image={false}>
      <div className="w-fit text-center flex-center gap-4">
        <div className="">
          <b>{getMessage()}</b>
        </div>
      </div>
    </NotificationWrapper>
  );
};

export default Welcome;
