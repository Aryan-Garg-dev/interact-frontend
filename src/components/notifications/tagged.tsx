import React from 'react';
import Link from 'next/link';
import { Notification } from '@/types';
import NotificationWrapper from '@/wrappers/notification';

interface Props {
  notification: Notification;
}

const Tagged = ({ notification }: Props) => {
  const getType = () => {
    switch (notification.notificationType) {
      case 21:
        return 'post';
      case 22:
        return 'announcement';
      case 23:
        return 'comment';
      default:
        return '';
    }
  };
  const getRedirectURL = () => {
    switch (notification.notificationType) {
      case 21:
        return '/explore/post/' + notification.postID;
      case 22:
        return '/explore/announcement/' + notification.announcementID;
      case 23:
        if (notification.comment.postID) return '/explore/post/' + notification.comment.postID;
        if (notification.comment.projectID) return '/explore?pid=' + notification.comment.project.slug;
        if (notification.comment.announcementID) return '/home' + notification.comment.announcement;
        if (notification.comment.taskID) {
          const task = notification.comment.task;
          if (task?.organizationID) return `/organisations?oid=${task.organizationID}&redirect_url=/tasks`;
          return '/workspace/tasks/' + task?.project?.slug;
        }
        return '#';
      default:
        return '#';
    }
  };
  return (
    <NotificationWrapper notification={notification}>
      <span>
        <Link className="font-bold" href={`/explore/user/${notification.sender.username}`}>
          {notification.sender.name}
        </Link>{' '}
      </span>
      tagged you in a
      <span>
        {' '}
        <Link className="font-bold capitalize" href={getRedirectURL()}>
          {getType()}.
        </Link>{' '}
      </span>
    </NotificationWrapper>
  );
};

export default Tagged;
