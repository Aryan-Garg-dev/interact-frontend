export interface TypingStatus {
  user: User;
  chatID: string;
}

export interface Education {
  university: string;
  degree: string;
  description: string;
}

export interface PostBookmark {
  id: string;
  userID: string;
  title: string;
  createdAt: Date;
  postItems: PostBookmarkItem[];
}

export interface PostBookmarkItem {
  id: string;
  postBookmarkID: string;
  postID: string;
  post: Post;
}

export interface ProjectBookmark {
  id: string;
  userID: string;
  title: string;
  createdAt: Date;
  projectItems: ProjectBookmarkItem[];
}

export interface ProjectBookmarkItem {
  id: string;
  projectBookmarkID: string;
  projectID: string;
  project: Project;
}

export interface OpeningBookmark {
  id: string;
  userID: string;
  title: string;
  createdAt: Date;
  openingItems: OpeningBookmarkItem[];
}

export interface OpeningBookmarkItem {
  id: string;
  openingBookmarkID: string;
  openingID: string;
  opening: Opening;
}

export interface EventBookmark {
  id: string;
  userID: string;
  title: string;
  createdAt: Date;
  eventItems: EventBookmarkItem[];
}

export interface EventBookmarkItem {
  id: string;
  eventBookmarkID: string;
  eventID: string;
  event: Event;
}

export interface Achievement {
  id: string;
  title: string;
  skills: string[];
}

export interface Membership {
  id: string;
  projectID: string;
  project: Project;
  userID: string;
  user: User;
  role: string;
  title: string;
  active: boolean;
  createdAt: Date;
}

export interface Opening {
  id: string;
  projectID: string;
  project: Project | null;
  organizationID: string;
  organization: Organization | null;
  userID: string;
  user: User;
  title: string;
  description: string;
  applications: [];
  noApplications: number;
  noImpressions: number;
  tags: string[];
  active: boolean;
  createdAt: Date;
}

export interface Profile {
  id: string;
  userID: string;
  achievements: Achievement[];
  school: string;
  degree: string;
  yearOfGraduation: number;
  description: string;
  areasOfCollaboration: string[];
  hobbies: string[];
  location: string;
  phoneNo: string;
  email: string;
}

export interface User {
  id: string;
  tags: string[];
  links: string[];
  email: string;
  name: string;
  resume: string;
  active: boolean;
  profilePic: string;
  coverPic: string;
  username: string;
  phoneNo: string;
  bio: string;
  title: string;
  tagline: string;
  profile: Profile;
  followers: User[];
  following: User[];
  memberships: Membership[];
  posts: Post[];
  projects: Project[];
  noFollowers: number;
  noFollowing: number;
  noImpressions: number;
  noProjects: number;
  noCollaborativeProjects: number;
  isFollowing?: boolean;
  isOnboardingComplete: boolean;
  passwordChangedAt: Date;
  lastViewed: Project[];
  isVerified: boolean;
  isOrganization: boolean;
  organization: Organization | null;
}

export interface OrganizationMembership {
  id: string;
  organizationID: string;
  organization: Organization;
  userID: string;
  user: User;
  role: string;
  title: string;
  createdAt: Date;
}

export interface Organization {
  id: string;
  userID: string;
  user: User;
  title: string;
  memberships: OrganizationMembership[];
  invitations: Invitation[];
  noMembers: number;
  noEvents: number;
  noProjects: number;
  createdAt: Date;
}

export interface Project {
  id: string;
  slug: string;
  userID: string;
  title: string;
  tagline: string;
  coverPic: string;
  blurHash: string;
  description: string;
  page: string;
  user: User;
  likedBy: User[];
  comments: Comment[];
  noLikes: number;
  noShares: number;
  noComments: number;
  noImpressions: number;
  tags: string[];
  category: string;
  memberships: Membership[];
  invitations: Invitation[];
  openings: Opening[];
  chats: GroupChat[];
  hashes: string[];
  isPrivate: boolean;
  views: number;
  totalNoViews: number;
  noMembers: number;
  privateLinks: string[];
  links: string[];
  createdAt: Date;
}

export interface PostTag {
  id: string;
  userID: string;
  user: User;
  postID: string;
}
export interface Post {
  id: string;
  userID: string;
  rePostID: string;
  rePost: Post | null;
  images: string[];
  content: string;
  user: User;
  noLikes: number;
  noShares: number;
  noComments: number;
  noImpressions: number;
  noReposts: number;
  isRePost: boolean;
  postedAt: Date;
  tags: string[];
  hashes: string[];
  isEdited: boolean;
  taggedUsers: User[];
}

export interface Comment {
  id: string;
  userID: string;
  user: User;
  postID: string;
  post: Post;
  projectID: string;
  project: Project;
  content: string;
  noLikes: number;
  likedBy: string[];
  createdAt: Date;
}

export interface Application {
  id: string;
  openingID: string;
  opening: Opening;
  projectID: string;
  project: Project | null;
  organizationID: string;
  organization: Organization | null;
  userID: string;
  user: User;
  email: string;
  status: number;
  content: string;
  resume: string;
  links: string[];
  score: number;
  createdAt: Date;
}

export interface Notification {
  id: string;
  notificationType: number;
  projectID: string;
  project: Project;
  postID: string;
  post: Post;
  userID: string;
  user: User;
  senderID: string;
  sender: User;
  openingID: string;
  opening: Opening;
  applicationID: string;
  application: Application;
  eventID: string;
  event: Event;
  announcementID: string;
  announcement: Announcement;
  impressionCount: number;
  isRead: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  content: string;
  chatID: string;
  chat: Chat | null;
  userID: string;
  user: User;
  read: boolean;
  postID: string;
  post: Post;
  projectID: string;
  project: Project;
  openingID: string;
  opening: Opening;
  profileID: string;
  profile: User;
  announcementID: string;
  announcement: Announcement;
  messageID: string;
  message: Message | null;
  createdAt: Date;
}

export interface GroupChatMessage {
  id: string;
  content: string;
  chatID: string;
  chat: GroupChat | null;
  userID: string;
  user: User;
  read: boolean;
  postID: string;
  post: Post;
  projectID: string;
  project: Project;
  openingID: string;
  opening: Opening;
  profileID: string;
  profile: User;
  announcementID: string;
  announcement: Announcement;
  messageID: string;
  message: GroupChatMessage | null;
  createdAt: Date;
}

export interface Chat {
  id: string;
  title: string;
  description: string;
  createdByID: string;
  createdBy: User;
  acceptedByID: string;
  acceptedBy: User;
  createdAt: Date;
  messages: Message[];
  latestMessageID: string;
  latestMessage: Message;
  lastReadMessageByCreatingUserID: string;
  lastReadMessageByAcceptingUserID: string;
  accepted: boolean;
  blockedByCreatingUser: boolean;
  blockedByAcceptingUser: boolean;
}

export interface GroupChat {
  id: string;
  title: string;
  description: string;
  coverPic: string;
  adminOnly: boolean;
  userID: string;
  user: User;
  organizationID: string;
  organization: Organization;
  projectID: string;
  project: Project;
  memberships: GroupChatMembership[];
  messages: GroupChatMessage[];
  invitations: Invitation[];
  latestMessageID: string;
  latestMessage: GroupChatMessage;
  createdAt: Date;
}

export interface GroupChatMembership {
  id: string;
  userID: string;
  user: User;
  chatID: string;
  chat: GroupChat;
  role: string;
  createdAt: Date;
}

export interface Invitation {
  id: string;
  userID: string;
  user: User;
  projectID: string;
  project: Project;
  organizationID: string;
  organization: Organization;
  chatID: string;
  chat: GroupChat;
  eventID: string;
  event: Event | null;
  title: string;
  status: number;
  isRead: boolean;
  createdAt: Date;
}

export interface SubTask {
  id: string;
  taskID: string;
  deadline: Date;
  title: string;
  description: string;
  tags: string[];
  users: User[];
  isCompleted: boolean;
  priority: PRIORITY;
}

export type PRIORITY = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  projectID: string;
  project: Project;
  deadline: Date;
  title: string;
  description: string;
  tags: string[];
  users: User[];
  isCompleted: boolean;
  subTasks: SubTask[];
  priority: PRIORITY;
}
export interface ResourceBucket {
  id: string;
  title: string;
  description: string;
  organizationID: string;
  noFiles: number;
  viewAccess: string;
  editAccess: string;
  resourceFiles: ResourceFile[];
  createdAt: Date;
}
export interface ResourceFile {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  resourceBucketID: string;
  userID: string;
  user: User;
  path: string;
  type: string;
  isFileUploaded: boolean;
}
export interface ProjectHistory {
  id: string;
  projectID: string;
  senderID: string;
  sender: User;
  historyType: number;
  userID: string;
  user: User;
  openingID: string;
  opening: Opening;
  applicationID: string;
  application: Application;
  invitationID: string;
  invitation: Invitation;
  taskID: string;
  task: Task;
  membershipID: string;
  membership: Membership;
  deletedText: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  organizationID: string;
  organization: Organization;
  coHosts: Organization[];
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  links: string[];
  coordinators: User[];
  startTime: Date;
  endTime: Date;
  location: string;
  category: string;
  coverPic: string;
  blurHash: string;
  noLikes: number;
  noShares: number;
  noComments: number;
  noImpressions: number;
  noViews: number;
  createdAt: Date;
  userID: string; //Dummy for type fixes in comment_box
}

export interface EventHistory {
  id: string;
  eventID: string;
  userID: string;
  user: User;
  title: boolean;
  tagline: boolean;
  description: boolean;
  tags: boolean;
  links: boolean;
  startTime: boolean;
  endTime: boolean;
  location: boolean;
  category: boolean;
  coverPic: boolean;
  createdAt: Date;
}

export interface OrganizationHistory {
  id: string;
  organizationID: string;
  historyType: number;
  userID: string;
  user: User;
  postID?: string;
  post?: Post;
  eventID?: string;
  event?: Event;
  projectID?: string;
  project?: Project;
  taskID?: string;
  task?: Task;
  invitationID?: string;
  invitation?: Invitation;
  pollID?: string;
  poll?: Poll;
  announcementID?: string;
  announcement?: Announcement;
  openingID?: string;
  opening?: Opening;
  applicationID?: string;
  application?: Application;
  membershipID?: string;
  membership?: OrganizationMembership;
  createdAt: Date;
  deletedText: String;
}

export interface College {
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  fuzzy: string;
}

export interface Review {
  id: string;
  userID: string;
  user: User;
  organizationID: string;
  content: string;
  rating: number;
  noUpVotes: number;
  noDownVotes: number;
  isAnonymous: boolean;
  createdAt: Date;
}

export interface Option {
  id: string;
  pollID: string;
  content: string;
  noVotes: number;
  votedBy: User[];
}

export interface Poll {
  id: string;
  organizationID: string;
  organization: Organization | null;
  title: string;
  content: string;
  options: Option[];
  isMultiAnswer: boolean;
  isOpen: boolean;
  totalVotes: number;
  createdAt: Date;
}

export interface Announcement {
  id: string;
  organizationID: string;
  organization: Organization | null;
  title: string;
  content: string;
  noLikes: number;
  noShares: number;
  noComments: number;
  createdAt: Date;
  isEdited: boolean;
  isOpen: boolean;
  taggedUsers: User[];
  userID: string; //Dummy for type fixes in comment_box
}
