import axios from 'axios';
import type { OMDBMovie, OMDBMovieDetails, OMDBSearchResponse, Movie, MovieDetails } from '../types/movie';

const OMDB_BASE_URL = 'https://www.omdbapi.com/';
const OMDB_API_KEY = 'eb2feb92'; // Твій ключ

const omdbClient = axios.create({
  baseURL: OMDB_BASE_URL,
  params: {
    apikey: OMDB_API_KEY
  }
});

// Функції для перетворення OMDB даних у наші внутрішні типи
const normalizeMovie = (omdbMovie: OMDBMovie): Movie => ({
  id: omdbMovie.imdbID,
  title: omdbMovie.Title,
  year: omdbMovie.Year,
  poster: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : '',
  type: omdbMovie.Type,
});

const normalizeMovieDetails = (omdbDetails: OMDBMovieDetails): MovieDetails => ({
  id: omdbDetails.imdbID,
  title: omdbDetails.Title,
  year: omdbDetails.Year,
  rated: omdbDetails.Rated,
  released: omdbDetails.Released,
  runtime: omdbDetails.Runtime,
  genre: omdbDetails.Genre,
  director: omdbDetails.Director,
  writer: omdbDetails.Writer,
  actors: omdbDetails.Actors,
  plot: omdbDetails.Plot,
  language: omdbDetails.Language,
  country: omdbDetails.Country,
  awards: omdbDetails.Awards,
  poster: omdbDetails.Poster !== 'N/A' ? omdbDetails.Poster : '',
  ratings: omdbDetails.Ratings || [],
  metascore: omdbDetails.Metascore,
  imdbRating: omdbDetails.imdbRating,
  imdbVotes: omdbDetails.imdbVotes,
  type: omdbDetails.Type,
  boxOffice: omdbDetails.BoxOffice,
  production: omdbDetails.Production,
});

// Тип для параметрів пошуку
interface SearchParams {
  s: string;
  page: string;
  y?: string;
  type?: string;
}

export const omdbApi = {
  // Пошук фільмів
  async searchMovies(query: string, page = 1, year?: string, type?: string): Promise<{ movies: Movie[]; totalResults: number }> {
    try {
      const params: SearchParams = {
        s: query,
        page: page.toString(),
      };
      
      if (year) params.y = year;
      if (type) params.type = type;

      const response = await omdbClient.get<OMDBSearchResponse>('', { params });
      
      if (response.data.Response === 'False') {
        return { movies: [], totalResults: 0 };
      }

      const movies = response.data.Search.map(normalizeMovie);
      const totalResults = parseInt(response.data.totalResults) || 0;

      return { movies, totalResults };
    } catch (error) {
      console.error('Error searching movies:', error);
      throw new Error('Failed to search movies');
    }
  },

  // Отримати деталі фільму за ID
  async getMovieById(imdbId: string): Promise<MovieDetails | null> {
    try {
      const response = await omdbClient.get<OMDBMovieDetails>('', {
        params: { i: imdbId, plot: 'full' }
      });

      if (response.data.Response === 'False') {
        return null;
      }

      return normalizeMovieDetails(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw new Error('Failed to fetch movie details');
    }
  },

  // Отримати популярні фільми (імітуємо через пошук популярних назв)
  async getPopularMovies(page = 1): Promise<{ movies: Movie[]; totalResults: number }> {
    const popularSearchTerms = [
      'Marvel', 'Star Wars', 'Batman', 'Spider', 'Avengers', 'Superman',
      'Iron Man', 'Thor', 'Captain America', 'Harry Potter'
    ];
    
    try {
      const randomTerm = popularSearchTerms[Math.floor(Math.random() * popularSearchTerms.length)];
      return await this.searchMovies(randomTerm, page, undefined, 'movie');
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw new Error('Failed to fetch popular movies');
    }
  },

  // Отримати фільми за роком
  async getMoviesByYear(year: string, page = 1): Promise<{ movies: Movie[]; totalResults: number }> {
    try {
      // Шукаємо фільми з популярними термінами за конкретний рік
      return await this.searchMovies('movie', page, year, 'movie');
    } catch (error) {
      console.error('Error fetching movies by year:', error);
      throw new Error('Failed to fetch movies by year');
    }
  },

  // Отримати рекомендовані фільми (високий рейтинг)
  async getFeaturedMovies(): Promise<Movie[]> {
    const featuredIds = [
      'tt0111161', // The Shawshank Redemption
      'tt0068646', // The Godfather
      'tt0468569', // The Dark Knight
      'tt0167260', // The Lord of the Rings: The Return of the King
      'tt0110912', // Pulp Fiction
      'tt0050083', // 12 Angry Men
    ];

    try {
      const movies: Movie[] = [];
      
      for (const id of featuredIds) {
        try {
          const details = await this.getMovieById(id);
          if (details) {
            movies.push({
              id: details.id,
              title: details.title,
              year: details.year,
              poster: details.poster,
              type: details.type,
            });
          }
        } catch (error) {
          console.error(`Error fetching featured movie ${id}:`, error);
        }
      }

      return movies;
    } catch (error) {
      console.error('Error fetching featured movies:', error);
      throw new Error('Failed to fetch featured movies');
    }
  }
};