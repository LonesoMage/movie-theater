import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FavoriteMovie } from '../../types/movie';

interface FavoritesState {
  favorites: FavoriteMovie[];
}

const loadFavoritesFromStorage = (): FavoriteMovie[] => {
  try {
    const stored = localStorage.getItem('movieTheater_favorites');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveFavoritesToStorage = (favorites: FavoriteMovie[]) => {
  try {
    localStorage.setItem('movieTheater_favorites', JSON.stringify(favorites));
  } catch {
    // Ignore storage errors
  }
};

const initialState: FavoritesState = {
  favorites: loadFavoritesFromStorage(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<string>) => {
      const movieId = action.payload;
      const exists = state.favorites.find((fav) => fav.movieId === movieId);
      
      if (!exists) {
        const newFavorite = {
          movieId,
          addedAt: new Date().toISOString(),
        };
        state.favorites.push(newFavorite);
        saveFavoritesToStorage(state.favorites);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter((fav) => fav.movieId !== action.payload);
      saveFavoritesToStorage(state.favorites);
    },
    clearFavorites: (state) => {
      state.favorites = [];
      saveFavoritesToStorage(state.favorites);
    },
  },
});

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;