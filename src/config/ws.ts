import {
  ChatSetupEvent,
  MeStopTyping,
  MeTyping,
  SendMessageEvent,
  SendMessageReadEvent,
  SendNotificationEvent,
  WSEvent,
  getWSEvent,
  routeChatListEvents,
  routeChatReadEvents,
  routeGroupChatListEvents,
  routeGroupMessagingWindowEvents,
  routeMessagingWindowEvents,
  sendEvent,
} from '@/helpers/ws';
import { incrementUnreadNotifications, setUnreadChats } from '@/slices/feedSlice';
import { store } from '@/store';
import { Chat, GroupChat, GroupChatMessage, Message, TypingStatus, User } from '@/types';
import { messageToastSettings } from '@/utils/toaster';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { SOCKET_URL } from './routes';

class SocketService {
  private static instance: SocketService | null = null;
  private socket: WebSocket | null = null;
  private chatIDs: string[] = [];

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public getSocket(): WebSocket | null {
    return this.socket;
  }

  public getChats(): string[] {
    return this.chatIDs;
  }

  public connect(userID: string | undefined = Cookies.get('id')): void {
    if (!this.socket) {
      if (!userID || userID == '') return;
      const token = Cookies.get('token');
      if (!token || token == '') return;
      this.socket = new WebSocket(`${SOCKET_URL}?userID=${userID}&token=${token}`);
      this.socket.addEventListener('open', event => {
        this.setupChats();
        this.setupChatNotifications();
        this.setupPushNotifications();
      });
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  public setupChats(chats?: string[]): void {
    if (this.socket) {
      if (!chats) {
        chats = store.getState().user.chats;
      }
      this.chatIDs = chats;
      const outgoingEvent = new ChatSetupEvent(chats);
      sendEvent('chat_setup', outgoingEvent, this.socket);
    }
  }

  public sendMessage(message: string, chatID: string, userID: string, self: User) {
    if (this.socket) {
      const outgoingMessageEvent = new SendMessageEvent(message, chatID, userID, self);
      sendEvent('send_message', outgoingMessageEvent, this.socket);
    }
  }

  public sendTypingStatus(self: User, chatID: string, status: number) {
    if (this.socket) {
      if (status == 0) {
        const outgoingStopTypingEvent = new MeStopTyping(self, chatID);
        sendEvent('me_stop_typing', outgoingStopTypingEvent, this.socket);
      } else {
        const outgoingEvent = new MeTyping(self, chatID);
        sendEvent('me_typing', outgoingEvent, this.socket);
      }
    }
  }

  public sendNotification(userID: string, content: string) {
    if (this.socket) {
      const outgoingNotificationEvent = new SendNotificationEvent(userID, content);
      sendEvent('send_notification', outgoingNotificationEvent, this.socket);
    }
  }

  public sendReadMessage(userID: string, messageID: string, chatID: string) {
    if (this.socket) {
      const outgoingNotificationEvent = new SendMessageReadEvent(userID, messageID, chatID);
      sendEvent('send_read_message', outgoingNotificationEvent, this.socket);
    }
  }

  public setupChatWindowRoutes(
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    typingStatus: TypingStatus,
    setTypingStatus: React.Dispatch<React.SetStateAction<TypingStatus>>
  ) {
    if (this.socket) {
      this.socket.addEventListener('message', function (evt) {
        const eventData = JSON.parse(evt.data);
        const event = new WSEvent(eventData.type, eventData.payload);
        routeMessagingWindowEvents(event, setMessages, typingStatus, setTypingStatus);
      });
    }
  }

  public setupGroupChatWindowRoutes(
    setMessages: React.Dispatch<React.SetStateAction<GroupChatMessage[]>>,
    typingStatus: TypingStatus,
    setTypingStatus: React.Dispatch<React.SetStateAction<TypingStatus>>
  ) {
    if (this.socket) {
      this.socket.addEventListener('message', function (evt) {
        const eventData = JSON.parse(evt.data);
        const event = new WSEvent(eventData.type, eventData.payload);
        routeGroupMessagingWindowEvents(event, setMessages, typingStatus, setTypingStatus);
      });
    }
  }

  public setupChatListRoutes(setChats: React.Dispatch<React.SetStateAction<Chat[]>>) {
    if (this.socket) {
      this.socket.addEventListener('message', function (evt) {
        const eventData = JSON.parse(evt.data);
        const event = new WSEvent(eventData.type, eventData.payload);
        routeChatListEvents(event, setChats);
      });
    }
  }

  public setupGroupChatListRoutes(setChats: React.Dispatch<React.SetStateAction<GroupChat[]>>) {
    if (this.socket) {
      this.socket.addEventListener('message', function (evt) {
        const eventData = JSON.parse(evt.data);
        const event = new WSEvent(eventData.type, eventData.payload);
        routeGroupChatListEvents(event, setChats);
      });
    }
  }

  public setupChatReadRoutes(setChat: React.Dispatch<React.SetStateAction<Chat>>) {
    if (this.socket) {
      this.socket.addEventListener('message', function (evt) {
        const eventData = JSON.parse(evt.data);
        const event = new WSEvent(eventData.type, eventData.payload);
        routeChatReadEvents(event, setChat);
      });
    }
  }

  private mapNotificationTypeToMessage(type: number, payload: any): string {
    switch (type) {
      case -1:
        return "Welcome to Interact";
      case 0:
        return `User started following you`;
      case 1:
        return `User liked your post`;
      case 2:
        return `User commented on your post`;
      case 3:
        return `User liked your project`;
      case 4:
        return `User commented on your project`;
      case 5:
        return `User applied for your project opening`;
      case 6:
        return `You got selected for the opening`;
      case 7:
        return `You got rejected for the opening`;
      case 8:
        return `You were removed from the project`;
      case 9:
        return `Chat request`;
      case 10:
        return `Accepted Project Invitation`;
      case 11:
        return `User assigned you a task in project`;
      case 12:
        return `User liked your event`;
      case 13:
        return `User commented on your event`;
      case 14:
        return `Your post got ${payload.impressions} impressions`;
      case 15:
        return `Your project got ${payload.impressions} impressions`;
      case 16:
        return `Your event got ${payload.impressions} impressions`;
      case 17:
        return `Your announcement got ${payload.impressions} impressions`;
      case 18:
        return `User liked your announcement`;
      case 19:
        return `User commented on your announcement`;
      case 20:
        return `User applied for your organization's opening`;
      case 21:
        return `Tagged in a Post`;
      case 22:
        return `Tagged in an Announcement`;
      default:
        return 'You have a new notification';
    }
  }

  public setupPushNotifications() {
    if (this.socket) {
      this.socket.addEventListener('message', (evt) => {
        const event = getWSEvent(evt);
        if (event.type === undefined) {
          alert('No Type in the Event');
          return;
        }

        switch (event.type) {
          case 'receive_notification':
            type WS_Notification = {
              userID: string;
              type: number;
              payload: any;
            };
            const notificationEventPayload = event.payload as WS_Notification;
            const message = this.mapNotificationTypeToMessage(notificationEventPayload.type, notificationEventPayload.payload);
            toast.info(message, {
              ...messageToastSettings,
              autoClose: 1000,
              icon: '🐵',
            });
            store.dispatch(incrementUnreadNotifications());
            break;
          default:
            break;
        }
      });
    }
  }

  public setupChatNotifications() {
    if (this.socket) {
      this.socket.addEventListener('message', function (evt) {
        const event = getWSEvent(evt);
        if (event.type === undefined) {
          alert('No Type in the Event');
        }

        switch (event.type) {
          case 'new_message':
            const messageEventPayload = event.payload as Message;
            const userID = store.getState().user.id;
            const unreadChatIDs = store.getState().feed.unreadChats;
            const currentChatID = store.getState().messaging.currentChatID;
            if (
              messageEventPayload.userID != userID &&
              !unreadChatIDs.includes(messageEventPayload.chatID) &&
              messageEventPayload.chatID != currentChatID
            )
              store.dispatch(setUnreadChats([...unreadChatIDs, messageEventPayload.chatID]));
            if (store.getState().messaging.currentChatID == '' && store.getState().messaging.currentGroupChatID == '')
              toast.info('New Message from: ' + messageEventPayload.user.name, {
                ...messageToastSettings,
                toastId: messageEventPayload.chatID,
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
            break;
          default:
            break;
        }
      });
    }
  }
}

const socketService = SocketService.getInstance();
export default socketService;
