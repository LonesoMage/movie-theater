import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SkeletonBox, SkeletonText } from '../Skeleton'
import { MovieCardSkeleton } from '../MovieCardSkeleton'

describe('Skeleton Components', () => {
  it('renders SkeletonBox with custom dimensions', () => {
    const { container } = render(<SkeletonBox width="200px" height="100px" />)
    const skeleton = container.firstChild as HTMLElement
    
    expect(skeleton).toHaveStyle({
      width: '200px',
      height: '100px'
    })
  })

  it('renders SkeletonText with default dimensions', () => {
    const { container } = render(<SkeletonText />)
    const skeleton = container.firstChild as HTMLElement
    
    expect(skeleton).toHaveStyle({
      height: '16px',
      width: '100%'
    })
  })

  it('renders MovieCardSkeleton structure', () => {
    render(<MovieCardSkeleton />)
    
    // Should have proper structure similar to MovieCard
    const skeletonElements = document.querySelectorAll('[class*="Skeleton"]')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })
})