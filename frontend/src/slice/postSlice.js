import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    post: [],
    loading: false,
    error: "",
};

const varToken = localStorage.getItem("logToken");
const header = {
    headers: {
        Authorization: "Bearer " + varToken,
    },
};

const isToken = localStorage.getItem("logToken");
if (isToken) {
    initialState.token = isToken;
}
export const postThunk = createAsyncThunk(
    "Post/postThunk",
    async (arg) => {
        try {
            const data = {
                title: arg.title,
                topic: arg.topic,
                description: arg.description
            };
            const AddPostRes = await axios.post(

                "http://localhost:3000/addPost",
                data, header
            );
            return AddPostRes;
        } catch (error) {
            throw new Error(error.response.data);

        }
    }
);

export const getPostThunk = createAsyncThunk(
    "Post/getPostThunk",
    async () => {
        try {
            const postRes = await axios.get(
                `${process.env.REACT_APP_URL}/posts/`,
                header
            );
            return postRes;
        } catch (error) {
            throw new Error(error.response.data);
        }
    }
);

const postSlice = createSlice({
    name: "Post",
    initialState,
    reducers: {
        errorReducer(state) {
            state.error = "";
        },

    },
    extraReducers: {
        [postThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [postThunk.fulfilled]: (state, action) => {
            state.loading = false;

            state.post = [action.payload.data.post];
        },
        [postThunk.rejected]: (state, error) => {
            state.loading = false;
            state.error = error.error.message;
        },
        [getPostThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [getPostThunk.fulfilled]: (state, action) => {
            state.loading = false;

            if (action.payload.data.post) {
                state.post = [action.payload.data.post];
            }
            if (action.payload.data.error) {
                state.error = [action.payload.data.error];
            }
        },
        [getPostThunk.rejected]: (state, error) => {
            state.loading = false;
            state.error = error.error.message;
        },

    },
});

export const postActions = postSlice.actions;
export default postSlice.reducer;
