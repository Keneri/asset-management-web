import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ChartState {
  name: string;
  label: string[];
  data: string[];
}

const initialState: ChartState = {
  name: "",
  label: [],
  data: [],
};

export const chartSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {
    setChartName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setChartLabel: (state, action: PayloadAction<string[]>) => {
      state.label = action.payload;
    },
    setChartData: (state, action: PayloadAction<string[]>) => {
      state.data = action.payload;
    },
  },
});

export const { setChartName, setChartLabel, setChartData } = chartSlice.actions;

export default chartSlice.reducer;
