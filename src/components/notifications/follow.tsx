import React from 'react';
import Link from 'next/link';
import { Notification } from '@/types';
import NotificationWrapper from '@/wrappers/notification';

interface Props {
  notification: Notification;
}

const Follow = ({ notification }: Props) => {
  const getMessage = () => {
    switch (notification.notificationType) {
      case 0:
        return `${notification.sender.name} started following you.`;
      default:
        return 'New follower notification.';
    }
  };

  const getRedirectURL = () => {
    switch (notification.notificationType) {
      case 0:
        return `/explore/user/${notification.sender.username}`;
      default:
        return '';
    }
  };

  return (
    <NotificationWrapper notification={notification}>
      <div>
        <span>
          <Link className="font-bold capitalize" href={getRedirectURL()}>
            {notification.sender.name}
          </Link>{' '}
        </span>
        {getMessage()}
      </div>
    </NotificationWrapper>
  );
};

export default Follow;
