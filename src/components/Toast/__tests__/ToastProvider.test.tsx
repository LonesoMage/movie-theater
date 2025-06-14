import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ToastProvider } from '../ToastProvider'
import { useToast } from '../../../hooks/useToast'

const TestComponent = () => {
  const { showToast } = useToast()
  
  return (
    <div>
      <button onClick={() => showToast('Success message', 'success')}>
        Show Success
      </button>
      <button onClick={() => showToast('Error message', 'error')}>
        Show Error
      </button>
      <button onClick={() => showToast('Info message', 'info')}>
        Show Info
      </button>
    </div>
  )
}

describe('ToastProvider', () => {
  it('shows and hides success toast', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )
    
    fireEvent.click(screen.getByText('Show Success'))
    
    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument()
      expect(screen.getByText('✅')).toBeInTheDocument()
    })
    
    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('shows error toast with correct styling', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )
    
    fireEvent.click(screen.getByText('Show Error'))
    
    await waitFor(() => {
      expect(screen.getByText('Error message')).toBeInTheDocument()
      expect(screen.getByText('❌')).toBeInTheDocument()
    })
  })

  it('allows manual closing of toast', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )
    
    fireEvent.click(screen.getByText('Show Info'))
    
    await waitFor(() => {
      expect(screen.getByText('Info message')).toBeInTheDocument()
    })
    
    const closeButton = screen.getByText('×')
    fireEvent.click(closeButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Info message')).not.toBeInTheDocument()
    })
  })
})