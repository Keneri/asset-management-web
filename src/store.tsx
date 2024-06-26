import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { stockApi } from "./shared/services/api/stock";
import { cryptoApi } from "./shared/services/api/crypto";

const rootReducer = combineReducers({
  [stockApi.reducerPath]: stockApi.reducer,
  [cryptoApi.reducerPath]: cryptoApi.reducer,
});

const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat([stockApi.middleware, cryptoApi.middleware]),
  });
};

const store = setupStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;

export type AppDispatch = AppStore["dispatch"];

export { store, setupStore };
