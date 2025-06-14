import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { MovieCard } from '../MovieCard'
import { ToastProvider } from '../../Toast/ToastProvider'
import movieReducer from '../../../store/slices/movieSlice'
import favoritesReducer from '../../../store/slices/favoritesSlice'
import { mockMovie } from '../../../test/mocks/movieData'

const mockOnViewDetails = vi.fn()

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      movies: movieReducer,
      favorites: favoritesReducer,
    },
    preloadedState: {
      movies: {
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
      },
      favorites: {
        favorites: []
      },
      ...initialState
    }
  })
}

const renderWithProviders = (ui: React.ReactElement, { initialState = {} } = {}) => {
  const store = createMockStore(initialState)
  
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>
          {ui}
        </ToastProvider>
      </BrowserRouter>
    </Provider>
  )
}

describe('MovieCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders movie information correctly', () => {
    renderWithProviders(<MovieCard movie={mockMovie} onViewDetails={mockOnViewDetails} />)
    
    expect(screen.getByTestId('movie-title')).toHaveTextContent('The Shawshank Redemption')
    expect(screen.getByText('1994')).toBeInTheDocument()
    expect(screen.getByText('фільм')).toBeInTheDocument()
  })

  it('shows fallback icon when poster is not available', () => {
    const movieWithoutPoster = { ...mockMovie, poster: 'N/A' }
    renderWithProviders(<MovieCard movie={movieWithoutPoster} onViewDetails={mockOnViewDetails} />)
    
    expect(screen.getByText('🎬')).toBeInTheDocument()
  })

  it('calls onViewDetails when details button is clicked', () => {
    renderWithProviders(<MovieCard movie={mockMovie} onViewDetails={mockOnViewDetails} />)
    
    fireEvent.click(screen.getByText('Деталі'))
    expect(mockOnViewDetails).toHaveBeenCalledWith('tt0111161')
  })

  it('toggles favorite status when favorite button is clicked', async () => {
    renderWithProviders(<MovieCard movie={mockMovie} onViewDetails={mockOnViewDetails} />)
    
    const favoriteButton = screen.getByTestId('favorite-button')
    expect(favoriteButton).toHaveTextContent('🤍')
    
    fireEvent.click(favoriteButton)
    
    await waitFor(() => {
      expect(favoriteButton).toHaveTextContent('❤️')
    })
  })

  it('shows toast notification when adding to favorites', async () => {
    renderWithProviders(<MovieCard movie={mockMovie} onViewDetails={mockOnViewDetails} />)
    
    const favoriteButton = screen.getByTestId('favorite-button')
    fireEvent.click(favoriteButton)
    
    await waitFor(() => {
      expect(screen.getByText('"The Shawshank Redemption" додано до обраних')).toBeInTheDocument()
    })
  })

  it('shows toast notification when removing from favorites', async () => {
    const initialState = {
      favorites: {
        favorites: [{ movieId: 'tt0111161', addedAt: new Date().toISOString() }]
      }
    }
    
    renderWithProviders(
      <MovieCard movie={mockMovie} onViewDetails={mockOnViewDetails} />,
      { initialState }
    )
    
    const favoriteButton = screen.getByTestId('favorite-button')
    expect(favoriteButton).toHaveTextContent('❤️')
    
    fireEvent.click(favoriteButton)
    
    await waitFor(() => {
      expect(screen.getByText('"The Shawshank Redemption" видалено з обраних')).toBeInTheDocument()
    })
  })
})