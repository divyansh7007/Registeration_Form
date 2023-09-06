import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'otp',
  initialState: {
    otp: '',
    },
  reducers: {
    setOtp: (state, action) => {
        state.otp = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setOtp } = counterSlice.actions

export default counterSlice.reducer