import { PROJECT_PIC_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import { Notification } from '@/types';
import NotificationWrapper from '@/wrappers/notification';
import Link from 'next/link';
import React from 'react';

interface Props {
  notification: Notification;
}

const Task = ({ notification }: Props) => {
  const getTitle = (): string => {
    switch (notification.notificationType) {
      case 11:
        return notification.project.title;
      default:
        return '';
    }
  };
  const getRedirectURL = () => {
    switch (notification.notificationType) {
      case 11:
        return '/workspace/tasks/' + notification.project.slug;
      default:
        return '';
    }
  };
  return (
    <NotificationWrapper notification={notification}>
      <span>
        <Link className="font-bold" href={`/explore/user/${notification.sender.username}`}>
          {notification.sender.name}
        </Link>{' '}
      </span>
      assigned you a{' '}
      <span>
        {' '}
        <Link className="font-bold" href={getRedirectURL()}>
          Task
        </Link>
      </span>{' '}
      in
      {' ' + getTitle()}
    </NotificationWrapper>
  );
};

export default Task;
