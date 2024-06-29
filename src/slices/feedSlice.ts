import { RootState } from '@/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface FeedState {
  unreadNotifications: number;
  unreadInvitations: number;
  unreadChats: string[];
  navbarOpen: boolean;
  profileCompletionOpen: boolean;
  homeTab: number;
  exploreTab: number;
  workspaceTab: number;
  bookmarksTab: number;
  invitationsTab: number;
  cookiesDisabled: boolean;
  onboarding: boolean;
  reviewModalOpen: boolean;
}

const initialState: FeedState = {
  unreadNotifications: 0,
  unreadInvitations: 0,
  unreadChats: [],
  navbarOpen: true,
  profileCompletionOpen: false,
  homeTab: 0,
  exploreTab: 0,
  workspaceTab: 0,
  bookmarksTab: 0,
  invitationsTab: 0,
  cookiesDisabled: true,
  onboarding: false,
  reviewModalOpen: false,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setNavbarOpen: (state, action: PayloadAction<boolean>) => {
      state.navbarOpen = action.payload;
    },
    setProfileCompletionOpen: (state, action: PayloadAction<boolean>) => {
      state.profileCompletionOpen = action.payload;
    },
    setHomeTab: (state, action: PayloadAction<number>) => {
      state.homeTab = action.payload;
    },
    setExploreTab: (state, action: PayloadAction<number>) => {
      state.exploreTab = action.payload;
    },
    setWorkspaceTab: (state, action: PayloadAction<number>) => {
      state.workspaceTab = action.payload;
    },
    setBookmarksTab: (state, action: PayloadAction<number>) => {
      state.bookmarksTab = action.payload;
    },
    setInvitationsTab: (state, action: PayloadAction<number>) => {
      state.invitationsTab = action.payload;
    },
    setUnreadNotifications: (state, action: PayloadAction<number>) => {
      state.unreadNotifications = action.payload;
    },
    incrementUnreadNotifications: state => {
      state.unreadNotifications = state.unreadNotifications + 1;
    },
    setUnreadInvitations: (state, action: PayloadAction<number>) => {
      state.unreadInvitations = action.payload;
    },
    incrementUnreadInvitations: state => {
      state.unreadInvitations = state.unreadInvitations + 1;
    },
    setUnreadChats: (state, action: PayloadAction<string[]>) => {
      state.unreadChats = action.payload;
    },
    setCookiesDisabled: (state, action: PayloadAction<boolean>) => {
      state.cookiesDisabled = action.payload;
    },
    setOnboarding: (state, action: PayloadAction<boolean>) => {
      state.onboarding = action.payload;
    },
    setReviewModalOpen: (state, action: PayloadAction<boolean>) => {
      state.reviewModalOpen = action.payload;
    },
  },
});

export const {
  setNavbarOpen,
  setProfileCompletionOpen,
  setHomeTab,
  setExploreTab,
  setWorkspaceTab,
  setBookmarksTab,
  setInvitationsTab,
  setUnreadNotifications,
  incrementUnreadNotifications,
  setUnreadInvitations,
  incrementUnreadInvitations,
  setUnreadChats,
  setCookiesDisabled,
  setOnboarding,
  setReviewModalOpen,
} = feedSlice.actions;

export default feedSlice.reducer;

export const navbarOpenSelector = (state: RootState) => state.feed.navbarOpen;
export const profileCompletionOpenSelector = (state: RootState) => state.feed.profileCompletionOpen;
export const homeTabSelector = (state: RootState) => state.feed.homeTab;
export const workspaceTabSelector = (state: RootState) => state.feed.workspaceTab;
export const exploreTabSelector = (state: RootState) => state.feed.exploreTab;
export const bookmarksTabSelector = (state: RootState) => state.feed.bookmarksTab;
export const invitationsTabSelector = (state: RootState) => state.feed.invitationsTab;
export const unreadNotificationsSelector = (state: RootState) => state.feed.unreadNotifications;
export const unreadInvitationsSelector = (state: RootState) => state.feed.unreadInvitations;
export const unreadChatsSelector = (state: RootState) => state.feed.unreadChats;
export const cookiesDisabledSelector = (state: RootState) => state.feed.cookiesDisabled;
export const onboardingSelector = (state: RootState) => state.feed.onboarding;
export const reviewModalOpenSelector = (state: RootState) => state.feed.reviewModalOpen;
