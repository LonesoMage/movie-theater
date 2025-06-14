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
    const { container } = render(<MovieCardSkeleton />)
    
    // Перевіряємо, що компонент відрендерився
    expect(container.firstChild).toBeInTheDocument()
    
    // Перевіряємо структуру - має бути контейнер з дочірніми елементами
    const mainContainer = container.firstChild as HTMLElement
    expect(mainContainer).toBeInTheDocument()
    expect(mainContainer.children.length).toBeGreaterThan(0)
    
    // Перевіряємо, що є div елементи (skeleton елементи)
    const divElements = container.querySelectorAll('div')
    expect(divElements.length).toBeGreaterThan(3)
  })
})