import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '../../../test/utils'
import { MovieCard } from '../MovieCard'
import { mockMovie } from '../../../test/mocks/movieData'

const mockOnViewDetails = vi.fn()

describe('MovieCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders movie information correctly', () => {
    render(<MovieCard movie={mockMovie} onViewDetails={mockOnViewDetails} />)
    
    expect(screen.getByTestId('movie-title')).toHaveTextContent('The Shawshank Redemption')
    expect(screen.getByText('1994')).toBeInTheDocument()
    expect(screen.getByText('фільм')).toBeInTheDocument()
  })

  it('shows fallback icon when poster is not available', () => {
    const movieWithoutPoster = { ...mockMovie, poster: 'N/A' }
    render(<MovieCard movie={movieWithoutPoster} onViewDetails={mockOnViewDetails} />)
    
    expect(screen.getByText('🎬')).toBeInTheDocument()
  })

  it('calls onViewDetails when details button is clicked', () => {
    render(<MovieCard movie={mockMovie} onViewDetails={mockOnViewDetails} />)
    
    fireEvent.click(screen.getByText('Деталі'))
    expect(mockOnViewDetails).toHaveBeenCalledWith('tt0111161')
  })

  it('toggles favorite status when favorite button is clicked', async () => {
    const { store } = render(<MovieCard movie={mockMovie} onViewDetails={mockOnViewDetails} />)
    
    const favoriteButton = screen.getByTestId('favorite-button')
    expect(favoriteButton).toHaveTextContent('🤍')
    
    fireEvent.click(favoriteButton)
    
    await waitFor(() => {
      expect(favoriteButton).toHaveTextContent('❤️')
    })
    
    const state = store.getState()
    expect(state.favorites.favorites).toHaveLength(1)
    expect(state.favorites.favorites[0].movieId).toBe('tt0111161')
  })

  it('shows toast notification when adding to favorites', async () => {
    render(<MovieCard movie={mockMovie} onViewDetails={mockOnViewDetails} />)
    
    const favoriteButton = screen.getByTestId('favorite-button')
    fireEvent.click(favoriteButton)
    
    await waitFor(() => {
      expect(screen.getByText('"The Shawshank Redemption" додано до обраних')).toBeInTheDocument()
    })
  })

  it('shows toast notification when removing from favorites', async () => {
    const preloadedState = {
      favorites: {
        favorites: [{ movieId: 'tt0111161', addedAt: new Date().toISOString() }]
      }
    }
    
    render(
      <MovieCard movie={mockMovie} onViewDetails={mockOnViewDetails} />,
      { preloadedState }
    )
    
    const favoriteButton = screen.getByTestId('favorite-button')
    expect(favoriteButton).toHaveTextContent('❤️')
    
    fireEvent.click(favoriteButton)
    
    await waitFor(() => {
      expect(screen.getByText('"The Shawshank Redemption" видалено з обраних')).toBeInTheDocument()
    })
  })
})