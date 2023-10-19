import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: [],
  token: "",
  isAuth: false,
  loading: false,
  error: "",
};



export const loginThunk = createAsyncThunk(
  "Login/loginThunk",
  async (arg) => {
    try {
      const data = {
        email: arg.email,
        password: arg.password,
        isAdmin: arg.isAdmin
      };
      const loginRes = await axios.post(
        // `${process.env.REACT_APP_URL}/login`,

        "http://localhost:3000/login",
        data
      );
      axios.defaults.headers.common["Authorization"] = loginRes.data.token;
      localStorage.setItem("logToken", loginRes.data.token);
      localStorage.setItem("userid", loginRes.data.user._id);
      localStorage.setItem("isAdmin", loginRes.data.user.isAdmin)
      return loginRes;
    } catch (error) {
      throw new Error(error.response.data);

    }
  }
);



const loginSlice = createSlice({
  name: "Login",
  initialState,
  reducers: {
    errorReducer(state) {
      state.error = "";
    },
    isAuthReducer(state) {
      state.isAuth = true;
    },
    logoutReducer(state) {
      state.isAuth = false;
      state.user = [];
      state.token = "";
    },
  },
  extraReducers: {
    [loginThunk.pending]: (state, action) => {
      state.loading = true;
    },
    [loginThunk.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuth = true;
      state.token = action.payload.data.token;

      state.user = [action.payload.data.user];
    },
    [loginThunk.rejected]: (state, error) => {
      state.loading = false;
      state.error = error.error.message;
    },
  },
});

export const loginActions = loginSlice.actions;
export default loginSlice.reducer;
