import { PROJECT_PIC_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import { Notification } from '@/types';
import NotificationWrapper from '@/wrappers/notification';
import Link from 'next/link';
import React from 'react';

interface Props {
  notification: Notification;
}

const Task = ({ notification }: Props) => {
  const getRedirectURL = () => {
    if (notification.task?.projectID != '') return '/workspace/tasks/' + notification.task.project?.slug;
    else return `/organisations?oid=${notification.task.organizationID}&redirect_url=/tasks`;
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
      {' ' + notification.task?.title}
    </NotificationWrapper>
  );
};

export default Task;
