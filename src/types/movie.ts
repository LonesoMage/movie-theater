// OMDB API Response типи
export interface OMDBMovie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OMDBMovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface Rating {
  Source: string;
  Value: string;
}

export interface OMDBSearchResponse {
  Search: OMDBMovie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

// Наші внутрішні типи (нормалізовані)
export interface Movie {
  id: string;
  title: string;
  year: string;
  poster: string;
  type: string;
}

export interface MovieDetails {
  id: string;
  title: string;
  year: string;
  rated: string;
  released: string;
  runtime: string;
  genre: string;
  director: string;
  writer: string;
  actors: string;
  plot: string;
  language: string;
  country: string;
  awards: string;
  poster: string;
  ratings: Rating[];
  metascore: string;
  imdbRating: string;
  imdbVotes: string;
  type: string;
  boxOffice: string;
  production: string;
}

export interface FavoriteMovie {
  movieId: string;
  addedAt: string;
}

export interface SearchFilters {
  year?: string;
  type?: 'movie' | 'series' | 'episode';
  page?: number;
}