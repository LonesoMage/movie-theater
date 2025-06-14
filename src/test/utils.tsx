import React, { type ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { ToastProvider } from '../components/Toast/ToastProvider'
import movieSlice from '../store/slices/movieSlice'
import favoritesSlice from '../store/slices/favoritesSlice'
import type { RootState } from '../store'

const createTestStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      movies: movieSlice,
      favorites: favoritesSlice,
    },
    preloadedState,
  })
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>
  store?: ReturnType<typeof createTestStore>
}

const customRender = (
  ui: ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>
          {children}
        </ToastProvider>
      </BrowserRouter>
    </Provider>
  )

  return {
    store,
    ...render(ui, { wrapper: AllTheProviders, ...renderOptions })
  }
}
// Re-export everything from React Testing Library
export * from '@testing-library/react'
// Override render method
export { customRender as render }