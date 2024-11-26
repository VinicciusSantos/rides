import { configureStore } from "@reduxjs/toolkit";

import rideReducer from "./slices/ride.slice";
import userReducer from "./slices/user.slice";

export const store = configureStore({
  reducer: {
    ride: rideReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
