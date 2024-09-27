import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    // Add the api reducer to the store
    [authSlice.reducerPath]: authSlice.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling, and other features of RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authSlice.middleware),
});
