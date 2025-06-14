import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FavoriteMovie } from '../../types/movie';

interface FavoritesState {
  favorites: FavoriteMovie[];
}

const initialState: FavoritesState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<string>) => {
      const movieId = action.payload;
      const exists = state.favorites.find(fav => fav.movieId === movieId);
      
      if (!exists) {
        state.favorites.push({
          movieId,
          addedAt: new Date().toISOString(),
        });
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(fav => fav.movieId !== action.payload);
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
});

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;