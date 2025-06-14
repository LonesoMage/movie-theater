import { omdbApi } from './omdbApi';
import type { Movie, MovieDetails } from '../types';

export const movieService = {
  // Отримати популярні фільми
  async getPopularMovies(page = 1): Promise<{ movies: Movie[]; totalResults: number; totalPages: number }> {
    try {
      const result = await omdbApi.getPopularMovies(page);
      const totalPages = Math.ceil(result.totalResults / 10); // OMDB повертає по 10 на сторінку
      
      return {
        ...result,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw new Error('Failed to fetch popular movies');
    }
  },

  // Отримати деталі фільму
  async getMovieById(id: string): Promise<MovieDetails> {
    try {
      const movie = await omdbApi.getMovieById(id);
      if (!movie) {
        throw new Error('Movie not found');
      }
      return movie;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw new Error('Failed to fetch movie details');
    }
  },

  // Пошук фільмів
  async searchMovies(query: string, page = 1, filters?: { year?: string; type?: string }): Promise<{ movies: Movie[]; totalResults: number; totalPages: number }> {
    try {
      if (!query.trim()) {
        return {
          movies: [],
          totalResults: 0,
          totalPages: 0
        };
      }
      
      const result = await omdbApi.searchMovies(query, page, filters?.year, filters?.type);
      const totalPages = Math.ceil(result.totalResults / 10);
      
      return {
        ...result,
        totalPages
      };
    } catch (error) {
      console.error('Error searching movies:', error);
      throw new Error('Failed to search movies');
    }
  },

  // Отримати фільми за роком
  async getMoviesByYear(year: string, page = 1): Promise<{ movies: Movie[]; totalResults: number; totalPages: number }> {
    try {
      const result = await omdbApi.getMoviesByYear(year, page);
      const totalPages = Math.ceil(result.totalResults / 10);
      
      return {
        ...result,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching movies by year:', error);
      throw new Error('Failed to fetch movies by year');
    }
  },

  // Отримати рекомендовані фільми 
  async getTopRatedMovies(): Promise<{ movies: Movie[]; totalResults: number; totalPages: number }> {
    try {
      const movies = await omdbApi.getFeaturedMovies();
      
      return {
        movies,
        totalResults: movies.length,
        totalPages: 1
      };
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw new Error('Failed to fetch top rated movies');
    }
  }
};