import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import roomService from './roomService'

const initialState = {
  rooms: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Create new room
export const updateAppRoom = createAsyncThunk(
  'rooms/create',
  async (roomData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await roomService.updateAppRoom(roomData, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get user room
export const getRooms = createAsyncThunk(
  'rooms/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await roomService.getRooms(token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Delete user goal
export const deleteRoom = createAsyncThunk(
  'rooms/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await roomService.deleteRoom(id, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateAppRoom.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateAppRoom.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.rooms.push(action.payload)
      })
      .addCase(updateAppRoom.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getRooms.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getRooms.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.rooms = action.payload
      })
      .addCase(getRooms.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteRoom.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.rooms = state.rooms.filter(
          (room) => room._id !== action.payload.id
        )
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = roomSlice.actions
export default roomSlice.reducer
