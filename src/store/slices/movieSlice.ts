import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Movie, MovieDetails } from '../../types/movie';

interface MovieState {
  // Популярні фільми
  popularMovies: Movie[];
  popularMoviesLoading: boolean;
  popularMoviesError: string | null;
  
  // Деталі фільму
  currentMovie: MovieDetails | null;
  currentMovieLoading: boolean;
  currentMovieError: string | null;
  
  // Пошук
  searchResults: Movie[];
  searchLoading: boolean;
  searchError: string | null;
  searchQuery: string;
  
  // Пагінація
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

const initialState: MovieState = {
  popularMovies: [],
  popularMoviesLoading: false,
  popularMoviesError: null,
  
  currentMovie: null,
  currentMovieLoading: false,
  currentMovieError: null,
  
  searchResults: [],
  searchLoading: false,
  searchError: null,
  searchQuery: '',
  
  currentPage: 1,
  totalPages: 1,
  totalResults: 0,
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    // Popular Movies
    setPopularMoviesLoading: (state, action: PayloadAction<boolean>) => {
      state.popularMoviesLoading = action.payload;
    },
    setPopularMoviesSuccess: (state, action: PayloadAction<{ movies: Movie[]; page: number; totalPages: number; totalResults: number }>) => {
      state.popularMovies = action.payload.movies;
      state.currentPage = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.totalResults = action.payload.totalResults;
      state.popularMoviesLoading = false;
      state.popularMoviesError = null;
    },
    setPopularMoviesError: (state, action: PayloadAction<string>) => {
      state.popularMoviesLoading = false;
      state.popularMoviesError = action.payload;
    },
    
    // Current Movie
    setCurrentMovieLoading: (state, action: PayloadAction<boolean>) => {
      state.currentMovieLoading = action.payload;
    },
    setCurrentMovieSuccess: (state, action: PayloadAction<MovieDetails>) => {
      state.currentMovie = action.payload;
      state.currentMovieLoading = false;
      state.currentMovieError = null;
    },
    setCurrentMovieError: (state, action: PayloadAction<string>) => {
      state.currentMovieLoading = false;
      state.currentMovieError = action.payload;
    },
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
      state.currentMovieError = null;
    },
    
    // Search
    setSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.searchLoading = action.payload;
    },
    setSearchSuccess: (state, action: PayloadAction<{ movies: Movie[]; totalResults: number; totalPages: number }>) => {
      state.searchResults = action.payload.movies;
      state.totalResults = action.payload.totalResults;
      state.totalPages = action.payload.totalPages;
      state.searchLoading = false;
      state.searchError = null;
    },
    setSearchError: (state, action: PayloadAction<string>) => {
      state.searchLoading = false;
      state.searchError = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
      state.searchError = null;
      state.totalResults = 0;
      state.totalPages = 1;
    },
  },
});

export const {
  setPopularMoviesLoading,
  setPopularMoviesSuccess,
  setPopularMoviesError,
  setCurrentMovieLoading,
  setCurrentMovieSuccess,
  setCurrentMovieError,
  clearCurrentMovie,
  setSearchLoading,
  setSearchSuccess,
  setSearchError,
  setSearchQuery,
  clearSearch,
} = movieSlice.actions;

export default movieSlice.reducer;