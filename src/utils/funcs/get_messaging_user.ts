import { Chat } from '@/types';
import Cookies from 'js-cookie';

const getMessagingUser = (chat: Chat) => {
  const userID = Cookies.get('id');
  if (chat.createdByID == userID) return chat.acceptedBy;
  return chat.createdBy;
};

export default getMessagingUser;
