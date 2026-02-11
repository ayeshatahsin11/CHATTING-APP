import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: "" ,
}
//  if the user is logged in only then we can show the data's from local storage and redux

export const messageslice = createSlice({
    name: 'userinfo',
    initialState,
    reducers: {
        selecteduser: (state, action) => {

            state.value = action.payload;
        },
        
    },
})

// Action creators are generated for each case reducer function
export const {selecteduser } = messageslice.actions

export default messageslice.reducer




