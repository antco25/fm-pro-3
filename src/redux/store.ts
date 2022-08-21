import { configureStore } from '@reduxjs/toolkit';
import appDataReducer from './appData/appDataSlice'
import dbDataReducer from './dbData/dbDataSlice';

const store = configureStore({
  reducer: {
    appData: appDataReducer,
    dbData: dbDataReducer
  },
});

export type RootState = ReturnType<typeof store.getState>
export default store;

