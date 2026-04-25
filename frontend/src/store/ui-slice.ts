import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  drawerOpen: boolean;
  drawerCandidateId: string | null;
  mobileSidebarOpen: boolean;
}

const initialState: UIState = {
  drawerOpen: false,
  drawerCandidateId: null,
  mobileSidebarOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openDrawer: (state, action: PayloadAction<string>) => {
      state.drawerCandidateId = action.payload;
      state.drawerOpen = true;
    },
    closeDrawer: (state) => {
      state.drawerOpen = false;
      state.drawerCandidateId = null;
    },
    toggleMobileSidebar: (state) => {
      state.mobileSidebarOpen = !state.mobileSidebarOpen;
    },
  },
});

export const { openDrawer, closeDrawer, toggleMobileSidebar } = uiSlice.actions;
export default uiSlice.reducer;