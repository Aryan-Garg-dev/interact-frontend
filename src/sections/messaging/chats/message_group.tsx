import { Chat, GroupChatMessage, Message } from '@/types';
import RegularMessage from '@/components/messaging/regular_message';
import SharedPostMessage from '@/components/messaging/shared_post_message';
import SharedProjectMessage from '@/components/messaging/shared_project_message';
import SharedOpeningMessage from '@/components/messaging/shared_opening_message';
import SharedProfileMessage from '@/components/messaging/shared_profile_message';
import Cookies from 'js-cookie';
import SharedAnnouncementMessage from '@/components/messaging/shared_announcement_message';

interface Props {
  date: string;
  messages: Message[] | GroupChatMessage[];
  chat?: Chat;
}

const MessageGroup = ({ date, messages, chat }: Props) => {
  const userID = Cookies.get('id');
  return (
    <div className="flex flex-col gap-4 mx-2 dark:text-white font-primary pt-4 pb-2">
      <div className="w-full text-center text-sm">{date}</div>
      <div className="flex flex-col-reverse gap-6">
        {messages.map(message => {
          return (
            <div key={message.id} className="flex flex-col gap-2">
              {message.postID != null ? (
                <SharedPostMessage message={message} />
              ) : message.projectID != null ? (
                <SharedProjectMessage message={message} />
              ) : message.openingID != null ? (
                <SharedOpeningMessage message={message} />
              ) : message.profileID != null ? (
                <SharedProfileMessage message={message} />
              ) : message.announcementID != null ? (
                <SharedAnnouncementMessage message={message} />
              ) : (
                <RegularMessage message={message} />
              )}
              {chat && chat.accepted && (
                <>
                  {userID == chat.acceptedByID && chat.lastReadMessageByCreatingUserID == message.id ? (
                    <div className="w-fit text-xs self-end opacity-75">• Seen</div>
                  ) : userID == chat.createdByID && chat.lastReadMessageByAcceptingUserID == message.id ? (
                    <div className="w-fit text-xs self-end opacity-75">• Seen</div>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageGroup;
