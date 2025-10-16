import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export let loginSlice = createSlice({
  name: 'auth',
  initialState: {
    userDetail: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null,
  },
  reducers: {
    saveUserdetail: (state, req) => {
      state.userDetail = req.payload.user;
      Cookies.set('user', JSON.stringify(req.payload.user), { expires: 1/24 }); 
    },

    logOut: (state) => {
      state.userDetail = null;
      Cookies.remove('user'); // ✅ instead of setting "null" string
    },
  },    
});

export const { saveUserdetail, logOut } = loginSlice.actions;
export default loginSlice.reducer;
