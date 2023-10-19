
import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../slice/userSlice";
import postReducer from "../slice/postSlice"

const store = configureStore({
    reducer: {
        loginStore: loginReducer,
        postStore: postReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
