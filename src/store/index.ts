import { configureStore } from '@reduxjs/toolkit';
import movieSlice from './slices/movieSlice';
import favoritesSlice from './slices/favoritesSlice';

export const store = configureStore({
  reducer: {
    movies: movieSlice,
    favorites: favoritesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;