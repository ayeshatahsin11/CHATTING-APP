import { configureStore } from '@reduxjs/toolkit'
import  userSlice  from './slices/userSlice'
import messageslice from './slices/messageslice'

export const store = configureStore({
  reducer: {
    user : userSlice,
    selecteduser : messageslice
  },
})

