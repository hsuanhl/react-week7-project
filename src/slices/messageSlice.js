import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const messageSlice = createSlice({
  name: "message",
  initialState: [],
  reducers: {
    createMessage(state, action) {
      state.push({
        id: action.payload.id,
        isSuccess: action.payload.success,
        text: action.payload.message,
      });
    },
    removeMessage(state, action) {
      const index = state.findIndex(
        (item) => item.id === action.payload
      );
      if (index !== -1) {
			  state.splice(index, 1);
			}
    },
  },
});

export const createAsyncMessage = createAsyncThunk(
  'message/createAsyncMessage',
  async (payload, { dispatch, requestId }) => {
    dispatch(messageSlice.actions.createMessage({
      ...payload,
      id: requestId,
    }));

    setTimeout(() => {
      dispatch(messageSlice.actions.removeMessage(requestId));
    }, 2000);
  }
);

export default messageSlice.reducer;
