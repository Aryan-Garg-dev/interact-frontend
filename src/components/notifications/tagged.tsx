import React from 'react';
import Link from 'next/link';
import { Notification } from '@/types';
import NotificationWrapper from '@/wrappers/notification';
import renderContentWithLinks from '@/utils/funcs/render_content_with_links';

interface Props {
  notification: Notification;
  short?: boolean;
}

const Tagged = ({ notification, short = true }: Props) => {
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
  const getContent = () => {
    var content = '';
    switch (notification.notificationType) {
      case 21:
        content = notification.post.content;
        break;
      case 22:
        content = notification.announcement.content;
        break;
      case 23:
        content = notification.comment.content;
        break;
      default:
        return '';
    }

    const regex = /\*\*|\^\^|```/g;
    return content.replace(regex, '');
  };
  return (
    <NotificationWrapper
      notification={notification}
      extended={
        !short && (
          <div className="w-fit max-w-[50%] text-xs rounded-md px-2 pt-1 bg-white line-clamp-2">{getContent()}</div>
        )
      }
    >
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
