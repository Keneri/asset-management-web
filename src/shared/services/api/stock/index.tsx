import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apikey = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

export const stockApi = createApi({
  reducerPath: "stockApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://www.alphavantage.co/" }),

  endpoints: (builder) => ({
    getDailyStockData: builder.query<any, string>({
      query: (symbol) => ({
        url: `query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apikey}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useLazyGetDailyStockDataQuery } = stockApi;
