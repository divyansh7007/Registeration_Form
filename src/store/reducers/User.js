import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    UserData: {
      name: "",
      email: "",
      password: "",
      img: "",
      _id: "",
    }
  },
  reducers: {
    userData: (state, action) => {
      state.UserData = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { userData } = counterSlice.actions

export default counterSlice.reducer