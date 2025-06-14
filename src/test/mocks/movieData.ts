import type { Movie, MovieDetails } from '../../types/movie'

export const mockMovie: Movie = {
  id: 'tt0111161',
  title: 'The Shawshank Redemption',
  year: '1994',
  poster: 'https://example.com/poster.jpg',
  type: 'movie',
}

export const mockMovieDetails: MovieDetails = {
  id: 'tt0111161',
  title: 'The Shawshank Redemption',
  year: '1994',
  rated: 'R',
  released: '14 Oct 1994',
  runtime: '142 min',
  genre: 'Drama',
  director: 'Frank Darabont',
  writer: 'Stephen King, Frank Darabont',
  actors: 'Tim Robbins, Morgan Freeman, Bob Gunton',
  plot: 'Two imprisoned men bond over a number of years...',
  language: 'English',
  country: 'United States',
  awards: 'Nominated for 7 Oscars',
  poster: 'https://example.com/poster.jpg',
  ratings: [
    { Source: 'Internet Movie Database', Value: '9.3/10' },
    { Source: 'Rotten Tomatoes', Value: '91%' },
  ],
  metascore: '80',
  imdbRating: '9.3',
  imdbVotes: '2,343,110',
  type: 'movie',
  boxOffice: '$16,000,000',
  production: 'Columbia Pictures',
}

export const mockMovies: Movie[] = [
  mockMovie,
  {
    id: 'tt0068646',
    title: 'The Godfather',
    year: '1972',
    poster: 'https://example.com/godfather.jpg',
    type: 'movie',
  },
  {
    id: 'tt0468569',
    title: 'The Dark Knight',
    year: '2008',
    poster: 'https://example.com/batman.jpg',
    type: 'movie',
  },
]