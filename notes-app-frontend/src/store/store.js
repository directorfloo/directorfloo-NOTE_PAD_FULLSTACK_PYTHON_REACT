import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import { registerApi } from "../api/register.jsx";
import { loginApi } from "../api/login.jsx";
import { noteApi } from "../api/note.jsx";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [registerApi.reducerPath]: registerApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [noteApi.reducerPath]: noteApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
          .concat(registerApi.middleware)
          .concat(loginApi.middleware)
          .concat(noteApi.middleware),
});
