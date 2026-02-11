import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") ) : "" ,
}
//  if the user is logged in only then we can show the data's from local storage and redux

export const userSlice = createSlice({
    name: 'userinfo',
    initialState,
    reducers: {
        userinfo: (state, action) => {

            state.value = action.payload;
        },
        removeuser: (state, action) => {
            state.value = "" ;
        }
    },
})

// Action creators are generated for each case reducer function
export const { userinfo , removeuser } = userSlice.actions

export default userSlice.reducer




