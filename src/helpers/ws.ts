import socketService from '@/config/ws';
import { store } from '@/store';
import { Chat, GroupChat, GroupChatMessage, Message, TypingStatus, User } from '@/types';
import { initialUser } from '@/types/initials';
import sortChats, { sortGroupChats } from '@/utils/funcs/sort_chats';
import { toast } from 'react-toastify';
import { messageToastSettings } from '../utils/toaster';

export class WSEvent {
  type = '';
  payload = {};
  constructor(type: string, payload: any) {
    this.type = type;
    this.payload = payload;
  }
}

export const getWSEvent = (evt: MessageEvent<any>) => {
  const eventData = JSON.parse(evt.data);
  return new WSEvent(eventData.type, eventData.payload);
};

export class SendMessageEvent {
  content = '';
  chatID = '';
  user = initialUser;
  userID = '';

  constructor(content: string, chatID: string, userID: string, user: User) {
    this.content = content;
    this.chatID = chatID;
    this.userID = userID;
    this.user = user;
  }
}

export class NewMessageEvent {
  content = '';
  chatID = '';
  user = initialUser;
  userID = '';
  createdAt: Date | string = '';
  read = false;

  constructor(content: string, chatID: string, userID: string, user: User, createdAt: Date) {
    this.content = content;
    this.chatID = chatID;
    this.userID = userID;
    this.user = user;
    this.createdAt = createdAt;
  }
}

export class SendNotificationEvent {
  content = '';
  userID = '';

  constructor(userID: string, content: string) {
    this.content = content;
    this.userID = userID;
  }
}

export class SendMessageReadEvent {
  userID = '';
  messageID = '';
  chatID = '';

  constructor(userID: string, messageID: string, chatID: string) {
    this.userID = userID;
    this.messageID = messageID;
    this.chatID = chatID;
  }
}

export class ChatSetupEvent {
  chats: string[] = [];
  constructor(chats: string[]) {
    this.chats = chats;
  }
}

export class ChangeChatRoomEvent {
  id = '';
  constructor(id: string) {
    this.id = id;
  }
}

export class MeTyping {
  user = initialUser;
  chatID = '';
  constructor(user: User, chatID: string) {
    this.user = user;
    this.chatID = chatID;
  }
}

export class MeStopTyping {
  user = initialUser;
  chatID = '';
  constructor(user: User, chatID: string) {
    this.user = user;
    this.chatID = chatID;
  }
}

export function routeMessagingWindowEvents(
  event: WSEvent,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  typingStatus: TypingStatus,
  setTypingStatus: React.Dispatch<React.SetStateAction<TypingStatus>>
) {
  if (event.type === undefined) {
    alert('No Type in the Event');
  }

  const userID = store.getState().user.id;
  const currentChatID = store.getState().messaging.currentChatID;

  switch (event.type) {
    case 'new_message':
      const messageEventPayload = event.payload as Message;
      if (messageEventPayload.chatID == currentChatID) setMessages(prev => [messageEventPayload, ...prev]);
      else if (currentChatID != '') {
        toast.info(messageEventPayload.user.name + ': ' + messageEventPayload.content, {
          ...messageToastSettings,
          icon: '🐵',
          // icon: () => (
          //   <Image
          //     width={100}
          //     height={100}
          //     src={`${USER_PROFILE_PIC_URL}/${messageEventPayload.user.profilePic}`}
          //     alt="User"
          //   />
          // ),
        });
      }

      if (messageEventPayload.userID != userID && currentChatID == messageEventPayload.chatID)
        socketService.sendReadMessage(userID, messageEventPayload.id, messageEventPayload.chatID);
      break;
    case 'user_typing':
      const userTypingEventPayload = event.payload as TypingStatus;
      setTypingStatus(userTypingEventPayload);
      break;
    case 'user_stop_typing':
      const userStopTypingEventPayload = event.payload as TypingStatus;
      if (userStopTypingEventPayload.user.id !== typingStatus.user.id) {
        const initialTypingStatus: TypingStatus = {
          user: initialUser,
          chatID: typingStatus.chatID,
        };
        setTypingStatus(initialTypingStatus);
      }
      break;
    default:
      break;
  }
}

export function routeGroupMessagingWindowEvents(
  event: WSEvent,
  setMessages: React.Dispatch<React.SetStateAction<GroupChatMessage[]>>,
  typingStatus: TypingStatus,
  setTypingStatus: React.Dispatch<React.SetStateAction<TypingStatus>>
) {
  if (event.type === undefined) {
    alert('No Type in the Event');
  }
  const currentGroupChatID = store.getState().messaging.currentGroupChatID;
  switch (event.type) {
    case 'new_message':
      const messageEventPayload = event.payload as GroupChatMessage;
      if (messageEventPayload.chatID == currentGroupChatID) setMessages(prev => [messageEventPayload, ...prev]);
      else if (currentGroupChatID != '') {
        toast.info(messageEventPayload.user.name + ': ' + messageEventPayload.content, {
          ...messageToastSettings,
          icon: '🐵',
          // icon: () => (
          //   <Image
          //     width={100}
          //     height={100}
          //     src={`${USER_PROFILE_PIC_URL}/${messageEventPayload.user.profilePic}`}
          //     alt="User"
          //   />
          // ),
        });
      }
      break;
    case 'user_typing':
      const userTypingEventPayload = event.payload as TypingStatus;
      setTypingStatus(userTypingEventPayload);
      break;
    case 'user_stop_typing':
      const userStopTypingEventPayload = event.payload as TypingStatus;
      if (userStopTypingEventPayload.user.id !== typingStatus.user.id) {
        const initialTypingStatus: TypingStatus = {
          user: initialUser,
          chatID: typingStatus.chatID,
        };
        setTypingStatus(initialTypingStatus);
      }
      break;
    default:
      break;
  }
}

export function routeChatListEvents(
  event: WSEvent,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
  // typingStatus: TypingStatus,
  // setTypingStatus: React.Dispatch<React.SetStateAction<TypingStatus>>
) {
  if (event.type === undefined) {
    alert('No Type in the Event');
  }

  switch (event.type) {
    case 'new_message':
      const messageEventPayload = event.payload as Message;
      setChats(prev =>
        sortChats(
          prev.map(chat => {
            if (chat.id == messageEventPayload.chatID) {
              chat.latestMessage = messageEventPayload;
            }
            return chat;
          })
        )
      );
      break;
    default:
      break;
  }
}

export function routeGroupChatListEvents(
  event: WSEvent,
  setChats: React.Dispatch<React.SetStateAction<GroupChat[]>>
  // typingStatus: TypingStatus,
  // setTypingStatus: React.Dispatch<React.SetStateAction<TypingStatus>>
) {
  if (event.type === undefined) {
    alert('No Type in the Event');
  }

  switch (event.type) {
    case 'new_message':
      const messageEventPayload = event.payload as GroupChatMessage;
      setChats(prev =>
        sortGroupChats(
          prev.map(chat => {
            if (chat.id == messageEventPayload.chatID) {
              chat.latestMessage = messageEventPayload;
            }
            return chat;
          })
        )
      );
      break;
    default:
      break;
  }
}

export function routeChatReadEvents(event: WSEvent, setChat: React.Dispatch<React.SetStateAction<Chat>>) {
  if (event.type === undefined) {
    alert('No Type in the Event');
  }

  const userID = store.getState().user.id;
  const currentChatID = store.getState().messaging.currentChatID;

  switch (event.type) {
    case 'read_message':
      //TODO handle a case where user 1 has sent message and his screen has socket ids and other user opens then chat and send read message socket request of backend id
      const payload = event.payload as Message;
      if (payload.userID != userID && currentChatID == payload.chatID)
        setChat(prev => {
          if (prev.acceptedByID == userID) return { ...prev, lastReadMessageByCreatingUserID: payload.id };
          else if (prev.createdByID == userID) return { ...prev, lastReadMessageByAcceptingUserID: payload.id };

          return prev;
        });
      break;
    default:
      break;
  }
}

export function sendEvent(eventName: string, payloadEvent: any, conn: WebSocket) {
  const event = new WSEvent(eventName, payloadEvent);

  try {
    conn.send(JSON.stringify(event));
  } catch (err) {
    alert('Socket connection error: ' + eventName);
  }
}
