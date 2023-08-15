import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dopen: true,
};

const AppSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateOpen: (state, action) => {
      state.dopen = action.payload;
    },
  },
});

export const { updateOpen } = AppSlice.actions;
export default AppSlice.reducer;