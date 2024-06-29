import { PROJECT_EDITOR, PROJECT_MANAGER, PROJECT_MEMBER } from '@/config/constants';
import { SERVER_ERROR } from '@/config/errors';
import {
  BOOKMARK_URL,
  CONNECTION_URL,
  INVITATION_URL,
  MESSAGING_URL,
  NOTIFICATION_URL,
  USER_URL,
  WORKSPACE_URL,
} from '@/config/routes';
import getHandler from '@/handlers/get_handler';

import {
  configSelector,
  setFetchedApplications,
  setFetchedChats,
  setFetchedContributingProjects,
  setFetchedEventBookmarks,
  setFetchedFollowing,
  setFetchedLikes,
  setFetchedOpeningBookmarks,
  setFetchedPostBookmarks,
  setFetchedProjectBookmarks,
  setFetchedProjects,
  setLastFetchedOrganizationMemberships,
  setLastFetchedUnreadChats,
  setLastFetchedUnreadInvitations,
  setLastFetchedUnreadNotifications,
  setLastFetchedVotedOptions,
} from '@/slices/configSlice';
import { setUnreadChats, setUnreadInvitations, setUnreadNotifications } from '@/slices/feedSlice';
import {
  ChatSlice,
  setApplications,
  setChats,
  setDisLikes,
  setEditorProjects,
  setEventBookmarks,
  setFollowing,
  setLikes,
  setManagerProjects,
  setMemberProjects,
  setOpeningBookmarks,
  setOrganizationMemberships,
  setOwnerProjects,
  setPersonalChatSlices,
  setPostBookmarks,
  setProjectBookmarks,
  setVotedOptions,
} from '@/slices/userSlice';
import {
  Application,
  Chat,
  EventBookmark,
  GroupChat,
  Membership,
  OpeningBookmark,
  OrganizationMembership,
  PostBookmark,
  Project,
  ProjectBookmark,
} from '@/types';
import Toaster from '@/utils/toaster';
import Cookies from 'js-cookie';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

const useUserStateFetcher = () => {
  const dispatch = useDispatch();

  const config = useSelector(configSelector);

  const userID = Cookies.get('id');

  const fetchFollowing = () => {
    if (moment().utc().diff(config.lastFetchedFollowing, 'minute') < 30) return;
    const URL = `${CONNECTION_URL}/following/me`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode == 200) {
          const followingIDsArr: string[] = res.data.userIDs || [];
          dispatch(setFollowing(followingIDsArr));
          dispatch(setFetchedFollowing(new Date().toUTCString()));
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  const fetchLikes = () => {
    if (moment().utc().diff(config.lastFetchedLikes, 'minute') < 30) return;
    const LIKES_URL = `${USER_URL}/me/likes`;
    getHandler(LIKES_URL)
      .then(res => {
        if (res.statusCode == 200) {
          const likesData: string[] = res.data.likes || [];
          dispatch(setLikes(likesData));
          dispatch(setFetchedLikes(new Date().toUTCString()));
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });

    const DISLIKES_URL = `${USER_URL}/me/dislikes`;
    getHandler(DISLIKES_URL)
      .then(res => {
        if (res.statusCode == 200) {
          const likesData: string[] = res.data.dislikes || [];
          dispatch(setDisLikes(likesData));
          dispatch(setFetchedLikes(new Date().toUTCString()));
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  const fetchBookmarks = () => {
    if (
      moment().utc().diff(config.lastFetchedPostBookmarks, 'minute') < 30 &&
      moment().utc().diff(config.lastFetchedProjectBookmarks, 'minute') < 30 &&
      moment().utc().diff(config.lastFetchedOpeningBookmarks, 'minute') < 30 &&
      moment().utc().diff(config.lastFetchedEventBookmarks, 'minute') < 30
    )
      return;

    const URL = `${BOOKMARK_URL}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode == 200) {
          const postBookmarksData: PostBookmark[] = res.data.postBookmarks || [];
          const projectBookmarksData: ProjectBookmark[] = res.data.projectBookmarks || [];
          const openingBookmarksData: OpeningBookmark[] = res.data.openingBookmarks || [];
          const eventBookmarksData: EventBookmark[] = res.data.eventBookmarks || [];
          dispatch(setPostBookmarks(postBookmarksData));
          dispatch(setProjectBookmarks(projectBookmarksData));
          dispatch(setOpeningBookmarks(openingBookmarksData));
          dispatch(setEventBookmarks(eventBookmarksData));
          dispatch(setFetchedPostBookmarks(new Date().toUTCString()));
          dispatch(setFetchedProjectBookmarks(new Date().toUTCString()));
          dispatch(setFetchedOpeningBookmarks(new Date().toUTCString()));
          dispatch(setFetchedEventBookmarks(new Date().toUTCString()));
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  const fetchChats = () => {
    if (moment().utc().diff(config.lastFetchedChats, 'minute') < 30) return;
    const URL = `${MESSAGING_URL}/me`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const personalChatSlices: ChatSlice[] = [];
          const chats: string[] = [];
          res.data.chats?.forEach((chat: Chat) => {
            chats.push(chat.id);
            personalChatSlices.push({
              chatID: chat.id,
              userID: chat.acceptedByID == userID ? chat.createdByID : chat.acceptedByID,
            });
          });
          res.data.groupChats?.forEach((chat: GroupChat) => {
            chats.push(chat.id);
          });
          dispatch(setPersonalChatSlices(personalChatSlices));
          dispatch(setChats(chats));
          dispatch(setFetchedChats(new Date().toUTCString()));
        } else Toaster.error(res.data.message, 'error_toaster');
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  const fetchProjects = () => {
    if (moment().utc().diff(config.lastFetchedProjects, 'minute') < 30) return;
    const URL = `${WORKSPACE_URL}/my`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const projects: string[] = [];

          res.data.projects?.forEach((project: Project) => {
            projects.push(project.id);
          });
          dispatch(setOwnerProjects(projects));
          dispatch(setFetchedProjects(new Date().toUTCString()));
        } else Toaster.error(res.data.message, 'error_toaster');
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  const fetchContributingProjects = () => {
    if (moment().utc().diff(config.lastFetchedContributingProjects, 'minute') < 30) return;
    const URL = `${WORKSPACE_URL}/memberships`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const memberProjects: string[] = [];
          const editorProjects: string[] = [];
          const managerProjects: string[] = [];

          res.data.memberships?.forEach((membership: Membership) => {
            switch (membership.role) {
              case PROJECT_MANAGER:
                managerProjects.push(membership.projectID);
                editorProjects.push(membership.projectID);
                memberProjects.push(membership.projectID);
                break;
              case PROJECT_EDITOR:
                editorProjects.push(membership.projectID);
                memberProjects.push(membership.projectID);
                break;
              case PROJECT_MEMBER:
                memberProjects.push(membership.projectID);
                break;
            }
          });
          dispatch(setManagerProjects(managerProjects));
          dispatch(setEditorProjects(editorProjects));
          dispatch(setMemberProjects(memberProjects));
          dispatch(setFetchedContributingProjects(new Date().toUTCString()));
        } else Toaster.error(res.data.message, 'error_toaster');
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  const fetchApplications = () => {
    if (moment().utc().diff(config.lastFetchedApplications, 'minute') < 30) return;
    const URL = `${WORKSPACE_URL}/applications`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const applications: string[] = [];
          res.data.applications?.forEach((application: Application) => {
            applications.push(application.openingID);
          });
          dispatch(setApplications(applications));
          dispatch(setFetchedApplications(new Date().toUTCString()));
        } else Toaster.error(res.data.message, 'error_toaster');
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  const fetchUnreadNotifications = () => {
    if (moment().utc().diff(config.lastFetchedUnreadNotifications, 'seconds') < 30) return;
    const URL = `${NOTIFICATION_URL}/unread/count`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const count: number = res.data.count;
          dispatch(setUnreadNotifications(count));
          dispatch(setLastFetchedUnreadNotifications(new Date().toUTCString()));
        } else Toaster.error(res.data.message, 'error_toaster');
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  const fetchUnreadInvitations = () => {
    if (moment().utc().diff(config.lastFetchedUnreadInvitations, 'minute') < 2) return;
    const URL = `${INVITATION_URL}/unread/count`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const count: number = res.data.count;
          dispatch(setUnreadInvitations(count));
          dispatch(setLastFetchedUnreadInvitations(new Date().toUTCString()));
        } else Toaster.error(res.data.message, 'error_toaster');
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  const fetchUnreadChats = () => {
    if (moment().utc().diff(config.lastFetchedUnreadChats, 'minute') < 2) return;
    const URL = `${MESSAGING_URL}/personal/unread`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const chatIDs: string[] = res.data.chatIDs;
          dispatch(setUnreadChats(chatIDs));
          dispatch(setLastFetchedUnreadChats(new Date().toUTCString()));
        } else Toaster.error(res.data.message, 'error_toaster');
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  const fetchOrganizationMemberships = () => {
    if (moment().utc().diff(config.lastFetchedOrganizationMemberships, 'minute') < 30) return;
    const URL = `${USER_URL}/me/organization/memberships`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const organizationMemberships: OrganizationMembership[] = res.data.memberships;
          dispatch(setOrganizationMemberships(organizationMemberships));
          dispatch(setLastFetchedOrganizationMemberships(new Date().toUTCString()));
        } else Toaster.error(res.data.message, 'error_toaster');
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  const fetchVotedOptions = () => {
    if (moment().utc().diff(config.lastFetchedVotedOptions, 'minute') < 5) return;
    const URL = `${USER_URL}/me/polls/options`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const votedOptions: string[] = res.data.options;
          dispatch(setVotedOptions(votedOptions));
          dispatch(setLastFetchedVotedOptions(new Date().toUTCString()));
        } else Toaster.error(res.data.message, 'error_toaster');
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  const fetchUserState = () => {
    fetchFollowing();
    fetchLikes();
    fetchBookmarks();
    fetchChats();
    fetchProjects();
    fetchContributingProjects();
    fetchApplications();
    fetchUnreadNotifications();
    fetchUnreadInvitations();
    fetchUnreadChats();
    fetchOrganizationMemberships();
    fetchVotedOptions();
  };

  return fetchUserState;
};

export default useUserStateFetcher;
