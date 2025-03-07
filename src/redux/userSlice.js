import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'userDetails',
  initialState: {
    user: "asdf",
  },
  reducers: {
    setName: (state, action) =>{
        // console.log('hello world');
        
        state.user = action.payload;
        // console.log(state.user);        
    }
  },
})

// Action creators are generated for each case reducer function
export const { setName } = userSlice.actions;

export default userSlice.reducer