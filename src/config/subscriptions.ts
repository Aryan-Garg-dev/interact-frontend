import { SUBSCRIPTIONS } from './constants';

interface MeetingConfig {
  MaxDuration: number;
  MaxMeetingsPerMonth: number;
  ParticipationReports: boolean;
  ScheduleReminderEmails: boolean;
  ChatsAndTranscripts: boolean;
  Recordings: boolean;
}

interface EventConfig {
  Enabled: boolean;
  ParticipationDetails: boolean;
  ChatsAndTranscripts: boolean;
  ReminderEmails: boolean;
  Recordings: boolean;
}

interface ResourceBucketConfig {
  MaxBuckets: number;
  MaxStoragePerBucketGB: number;
  MaxBucketFileSizeMB: number;
}

interface TaskConfig {
  Management: boolean;
  Conversations: boolean;
  SchedulingEmails: boolean;
  ReminderEmails: boolean;
}

interface PollConfig {
  OrgOnly: boolean;
  OrgAndOpenForAll: boolean;
}

export interface SubscriptionConfig {
  Name: string;
  Analytics: boolean;
  Meetings: MeetingConfig;
  Event: EventConfig;
  ResourceBuckets: ResourceBucketConfig;
  Tasks: TaskConfig;
  Teams: boolean;
  Reach: string;
  AnnouncementsAndPolls: PollConfig;
  OrgOpenings: boolean;
  ProjectManagement: boolean;
}

const SubscriptionsConfig: Record<string, SubscriptionConfig> = {
  [SUBSCRIPTIONS.ORG_FREE]: {
    Name: 'Free',
    Analytics: false,
    Meetings: {
      MaxDuration: 60,
      MaxMeetingsPerMonth: 10,
      ParticipationReports: true,
      ScheduleReminderEmails: false,
      ChatsAndTranscripts: false,
      Recordings: false,
    },
    Event: {
      Enabled: false,
      ParticipationDetails: false,
      ChatsAndTranscripts: false,
      ReminderEmails: false,
      Recordings: false,
    },
    ResourceBuckets: {
      MaxBuckets: 5,
      MaxStoragePerBucketGB: 1,
      MaxBucketFileSizeMB: 5,
    },
    Tasks: {
      Management: true,
      Conversations: false,
      SchedulingEmails: false,
      ReminderEmails: false,
    },
    Teams: false,
    Reach: 'Same',
    AnnouncementsAndPolls: {
      OrgOnly: true,
      OrgAndOpenForAll: false,
    },
    OrgOpenings: false,
    ProjectManagement: false,
  },
  [SUBSCRIPTIONS.ORG_BASE]: {
    Name: 'Base',
    Analytics: true,
    Meetings: {
      MaxDuration: 150,
      MaxMeetingsPerMonth: 30,
      ParticipationReports: true,
      ScheduleReminderEmails: true,
      ChatsAndTranscripts: true,
      Recordings: false,
    },
    Event: {
      Enabled: true,
      ParticipationDetails: true,
      ChatsAndTranscripts: true,
      ReminderEmails: true,
      Recordings: false,
    },
    ResourceBuckets: {
      MaxBuckets: 10,
      MaxStoragePerBucketGB: 5,
      MaxBucketFileSizeMB: 50,
    },
    Tasks: {
      Management: true,
      Conversations: true,
      SchedulingEmails: true,
      ReminderEmails: false,
    },
    Teams: true,
    Reach: 'Same',
    AnnouncementsAndPolls: {
      OrgOnly: false,
      OrgAndOpenForAll: true,
    },
    OrgOpenings: true,
    ProjectManagement: false,
  },
  [SUBSCRIPTIONS.ORG_PREMIUM]: {
    Name: 'Premium',
    Analytics: true,
    Meetings: {
      MaxDuration: 300,
      MaxMeetingsPerMonth: 50,
      ParticipationReports: true,
      ScheduleReminderEmails: true,
      ChatsAndTranscripts: true,
      Recordings: true,
    },
    Event: {
      Enabled: true,
      ParticipationDetails: true,
      ChatsAndTranscripts: true,
      ReminderEmails: true,
      Recordings: true,
    },
    ResourceBuckets: {
      MaxBuckets: 50,
      MaxStoragePerBucketGB: 5,
      MaxBucketFileSizeMB: 250,
    },
    Tasks: {
      Management: true,
      Conversations: true,
      SchedulingEmails: true,
      ReminderEmails: true,
    },
    Teams: true,
    Reach: 'Better',
    AnnouncementsAndPolls: {
      OrgOnly: false,
      OrgAndOpenForAll: true,
    },
    OrgOpenings: true,
    ProjectManagement: true,
  },
};

export default SubscriptionsConfig;
