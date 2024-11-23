import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EstimateRideResponse } from "@/services/ride.service";

interface RideState {
  estimate: EstimateRideResponse | null;
}

const initialState: RideState = {
  estimate: null,
};

const rideSlice = createSlice({
  name: "ride",
  initialState,
  reducers: {
    setEstimate: (state, action: PayloadAction<EstimateRideResponse>) => {
      state.estimate = action.payload;
    },
    clearEstimate: (state) => {
      state.estimate = null;
    },
  },
});

export const { setEstimate, clearEstimate } = rideSlice.actions;

export default rideSlice.reducer;
