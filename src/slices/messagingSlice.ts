import { RootState } from '@/store';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface MessagingState {
  currentChatID: string;
  currentGroupChatID: string;
  messagingTab: number;
}

const initialState: MessagingState = {
  currentChatID: '',
  currentGroupChatID: '',
  messagingTab: 0,
};

export const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    setCurrentChatID: (state, action: PayloadAction<string>) => {
      state.currentChatID = action.payload;
    },
    setCurrentGroupChatID: (state, action: PayloadAction<string>) => {
      state.currentGroupChatID = action.payload;
    },
    setMessagingTab: (state, action: PayloadAction<number>) => {
      state.messagingTab = action.payload;
    },
  },
});

export const { setCurrentChatID, setCurrentGroupChatID, setMessagingTab } = messagingSlice.actions;

export default messagingSlice.reducer;

export const currentChatIDSelector = (state: RootState) => state.messaging.currentChatID;
export const currentGroupChatIDSelector = (state: RootState) => state.messaging.currentGroupChatID;
export const messagingTabSelector = (state: RootState) => state.messaging.messagingTab;
