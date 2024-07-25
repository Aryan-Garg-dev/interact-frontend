import { RootState } from '@/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface MessagingState {
  currentChatID: string;
  messagingTab: number;
}

const initialState: MessagingState = {
  currentChatID: '',
  messagingTab: 0,
};

export const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    setCurrentChatID: (state, action: PayloadAction<string>) => {
      state.currentChatID = action.payload;
    },
    setMessagingTab: (state, action: PayloadAction<number>) => {
      state.messagingTab = action.payload;
    },
  },
});

export const { setCurrentChatID, setMessagingTab } = messagingSlice.actions;

export default messagingSlice.reducer;

export const currentChatIDSelector = (state: RootState) => state.messaging.currentChatID;
export const messagingTabSelector = (state: RootState) => state.messaging.messagingTab;
