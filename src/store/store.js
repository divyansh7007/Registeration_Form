import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from "./reducers/User"
import OtpReducer from './reducers/otp';

export default configureStore({
  reducer: {
    user: userDataReducer,
    otp: OtpReducer
  },
})