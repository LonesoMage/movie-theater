import { omdbApi } from './omdbApi';
import type { Movie, MovieDetails } from '../types';

export const movieService = {
  async getPopularMovies(page = 1): Promise<{ movies: Movie[]; totalResults: number; totalPages: number }> {
    try {
      const result = await omdbApi.getPopularMovies(page);
      const totalPages = Math.ceil(result.totalResults / 10);
      
      return {
        ...result,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw new Error('Failed to fetch popular movies');
    }
  },

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

  async searchMoviesByActor(actorName: string, page = 1): Promise<{ movies: Movie[]; totalResults: number; totalPages: number }> {
    try {
      if (!actorName.trim()) {
        return {
          movies: [],
          totalResults: 0,
          totalPages: 0
        };
      }

      // Спробуємо різні стратегії пошуку
      const searchStrategies = [
        // 1. Пошук за повним ім'ям
        actorName,
        // 2. Пошук за прізвищем (якщо є пробіл)
        actorName.includes(' ') ? actorName.split(' ').pop() || actorName : null,
        // 3. Пошук за ім'ям (якщо є пробіл)
        actorName.includes(' ') ? actorName.split(' ')[0] : null,
        // 4. Пошук з популярними фільмами актора (якщо знаємо)
        this.getKnownActorMovies(actorName)
      ].filter(Boolean) as string[];

      const allMovies: Movie[] = [];
      let bestResult = { movies: [] as Movie[], totalResults: 0 };

      // Пробуємо кожну стратегію
      for (const searchTerm of searchStrategies) {
        try {
          const result = await omdbApi.searchMovies(searchTerm, page);
          
          // Фільтруємо фільми, які дійсно містять актора в описі
          const relevantMovies = await this.filterMoviesByActor(result.movies, actorName);
          
          if (relevantMovies.length > bestResult.movies.length) {
            bestResult = {
              movies: relevantMovies,
              totalResults: relevantMovies.length
            };
          }
          
          // Додаємо унікальні фільми до загального списку
          relevantMovies.forEach(movie => {
            if (!allMovies.find(m => m.id === movie.id)) {
              allMovies.push(movie);
            }
          });
          
          // Якщо знайшли достатньо фільмів, припиняємо пошук
          if (allMovies.length >= 10) break;
          
        } catch (error) {
          console.warn(`Search strategy failed for: ${searchTerm}`, error);
          continue;
        }
      }

      // Повертаємо найкращий результат або всі знайдені фільми
      const finalMovies = allMovies.length > 0 ? allMovies : bestResult.movies;
      const totalPages = Math.ceil(finalMovies.length / 10);
      
      return {
        movies: finalMovies,
        totalResults: finalMovies.length,
        totalPages: Math.max(1, totalPages)
      };
    } catch (error) {
      console.error('Error searching movies by actor:', error);
      throw new Error('Failed to search movies by actor');
    }
  },

  // Допоміжний метод для фільтрації фільмів за актором
  async filterMoviesByActor(movies: Movie[], actorName: string): Promise<Movie[]> {
    const relevantMovies: Movie[] = [];
    
    // Обмежуємо кількість запитів для деталей
    const moviesToCheck = movies.slice(0, 15);
    
    for (const movie of moviesToCheck) {
      try {
        const details = await omdbApi.getMovieById(movie.id);
        if (details && details.actors && details.actors !== 'N/A') {
          // Перевіряємо, чи актор згадується в списку акторів
          const actorsLower = details.actors.toLowerCase();
          const actorNameLower = actorName.toLowerCase();
          
          // Перевіряємо різні варіанти імені
          const nameVariants = [
            actorNameLower,
            actorNameLower.split(' ').reverse().join(' '), // Прізвище, Ім'я
            ...actorNameLower.split(' ') // Окремі частини імені
          ];
          
          const found = nameVariants.some(variant => 
            variant.length > 2 && actorsLower.includes(variant)
          );
          
          if (found) {
            relevantMovies.push(movie);
          }
        }
      } catch (error) {
        // Якщо не вдалося отримати деталі, залишаємо фільм у списку
        console.warn(`Could not verify actor for movie ${movie.id}:`, error);
        relevantMovies.push(movie);
      }
    }
    
    return relevantMovies;
  },

  // Допоміжний метод з відомими фільмами популярних акторів
  getKnownActorMovies(actorName: string): string | null {
    const knownActors: Record<string, string> = {
      'Robert Downey Jr.': 'Iron Man',
      'Robert Downey Jr': 'Iron Man',
      'Chris Evans': 'Captain America',
      'Chris Hemsworth': 'Thor',
      'Scarlett Johansson': 'Black Widow',
      'Mark Ruffalo': 'Hulk',
      'Jeremy Renner': 'Hawkeye',
      'Tom Holland': 'Spider-Man',
      'Benedict Cumberbatch': 'Doctor Strange',
      'Paul Rudd': 'Ant-Man',
      'Brie Larson': 'Captain Marvel',
      'Anthony Mackie': 'Falcon',
      'Sebastian Stan': 'Winter Soldier',
      'Tom Hiddleston': 'Loki',
      'Samuel L. Jackson': 'Nick Fury',
      'Leonardo DiCaprio': 'Titanic',
      'Brad Pitt': 'Fight Club',
      'Will Smith': 'Men in Black',
      'Tom Cruise': 'Mission Impossible',
      'Johnny Depp': 'Pirates of the Caribbean',
      'Angelina Jolie': 'Lara Croft',
      'Matt Damon': 'Bourne',
      'Keanu Reeves': 'Matrix',
      'Harrison Ford': 'Indiana Jones',
      'Arnold Schwarzenegger': 'Terminator'
    };
    
    return knownActors[actorName] || null;
  },

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
  },

  async getMoviesByGenre(genre: string, page = 1): Promise<{ movies: Movie[]; totalResults: number; totalPages: number }> {
    try {
      const searchTermsByGenre: Record<string, string> = {
        'action': 'action',
        'comedy': 'comedy',
        'drama': 'drama',
        'horror': 'horror',
        'romance': 'romance',
        'thriller': 'thriller',
        'adventure': 'adventure',
        'animation': 'animation',
        'crime': 'crime',
        'documentary': 'documentary',
        'family': 'family',
        'fantasy': 'fantasy',
        'history': 'history',
        'music': 'music',
        'mystery': 'mystery',
        'sci-fi': 'science fiction',
        'war': 'war',
        'western': 'western'
      };

      const searchTerm = searchTermsByGenre[genre.toLowerCase()] || genre;
      const result = await omdbApi.searchMovies(searchTerm, page, undefined, 'movie');
      const totalPages = Math.ceil(result.totalResults / 10);
      
      return {
        ...result,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      throw new Error('Failed to fetch movies by genre');
    }
  }
};