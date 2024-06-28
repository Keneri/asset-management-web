import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetCryptoListResponseType } from "./types";

const apiKeyString = `x_cg_api_key=${process.env.REACT_APP_COIN_GECKO_API_KEY}`;

// type GetCoinDataQueryType = {
//   coinId: string;
//   currency: string;
//   days: number;
// };

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.coingecko.com/api/v3/",
  }),

  endpoints: (builder) => ({
    getCryptoList: builder.query<GetCryptoListResponseType, void>({
      query: () => ({
        url: `coins/list?${apiKeyString}`,
        method: "GET",
      }),
    }),
    getCoinData: builder.query<any, string>({
      query: (coinId) => ({
        url: `coins/${coinId}?sparkline=true`,
        method: "GET",
      }),
    }),
    getDailyCoinData: builder.query<any, string>({
      query: (coinId) => ({
        url: `coins/${coinId}/market_chart?vs_currency=usd&days=100`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCryptoListQuery,
  useLazyGetCoinDataQuery,
  useLazyGetDailyCoinDataQuery,
} = cryptoApi;
