import { Chat, GroupChat } from '@/types';
import moment from 'moment';

const sortChats = (chats: Chat[]): Chat[] => {
  const sortedChats = chats.sort((a, b) => {
    const latestMessageA = a.latestMessage?.createdAt || a.createdAt;
    const latestMessageB = b.latestMessage?.createdAt || b.createdAt;

    return moment(latestMessageB).valueOf() - moment(latestMessageA).valueOf();
  });

  return sortedChats;
};

export const sortGroupChats = (chats: GroupChat[]): GroupChat[] => {
  const sortedChats = chats.sort((a, b) => {
    const latestMessageA = a.latestMessage?.createdAt || a.createdAt;
    const latestMessageB = b.latestMessage?.createdAt || b.createdAt;

    return moment(latestMessageB).valueOf() - moment(latestMessageA).valueOf();
  });

  return sortedChats;
};

export default sortChats;
