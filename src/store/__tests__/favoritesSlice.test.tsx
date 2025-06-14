import { describe, it, expect } from 'vitest'
import favoritesReducer, { 
  addToFavorites, 
  removeFromFavorites, 
  clearFavorites 
} from '../slices/favoritesSlice'

describe('favoritesSlice', () => {
  const initialState = {
    favorites: []
  }

  it('should handle initial state', () => {
    expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle adding to favorites', () => {
    const actual = favoritesReducer(initialState, addToFavorites('tt0111161'))
    
    expect(actual.favorites).toHaveLength(1)
    expect(actual.favorites[0].movieId).toBe('tt0111161')
    expect(actual.favorites[0].addedAt).toBeDefined()
  })

  it('should not add duplicate favorites', () => {
    const stateWithFavorite = {
      favorites: [{ movieId: 'tt0111161', addedAt: '2023-01-01' }]
    }
    
    const actual = favoritesReducer(stateWithFavorite, addToFavorites('tt0111161'))
    
    expect(actual.favorites).toHaveLength(1)
  })

  it('should handle removing from favorites', () => {
    const stateWithFavorites = {
      favorites: [
        { movieId: 'tt0111161', addedAt: '2023-01-01' },
        { movieId: 'tt0068646', addedAt: '2023-01-02' }
      ]
    }
    
    const actual = favoritesReducer(stateWithFavorites, removeFromFavorites('tt0111161'))
    
    expect(actual.favorites).toHaveLength(1)
    expect(actual.favorites[0].movieId).toBe('tt0068646')
  })

  it('should handle clearing all favorites', () => {
    const stateWithFavorites = {
      favorites: [
        { movieId: 'tt0111161', addedAt: '2023-01-01' },
        { movieId: 'tt0068646', addedAt: '2023-01-02' }
      ]
    }
    
    const actual = favoritesReducer(stateWithFavorites, clearFavorites())
    
    expect(actual.favorites).toHaveLength(0)
  })
})