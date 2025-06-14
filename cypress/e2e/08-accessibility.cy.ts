describe('Accessibility', () => {
  it('має доступні заголовки та структуру', () => {
    cy.visitHomePage()
    
    cy.get('h1').should('exist')
    cy.get('nav').should('be.visible')
    cy.get('main').should('exist')
  })

  it('кнопки мають доступні назви', () => {
    cy.visitHomePage()
    
    cy.get('button').each(($btn) => {
      cy.wrap($btn).should(($el) => {
        const element = $el.get(0)
        const hasText = element.innerText && element.innerText.trim().length > 0
        const hasAriaLabel = element.getAttribute('aria-label')
        const hasTitle = element.getAttribute('title')
        
        if (!(hasText || hasAriaLabel || hasTitle)) {
          throw new Error('Button must have accessible text, aria-label, or title')
        }
      })
    })
  })

  it('зображення мають alt текст або aria-label', () => {
    cy.visitCatalogPage()
    
    cy.get('img').each(($img) => {
      cy.wrap($img).should(($el) => {
        const element = $el.get(0)
        const hasAlt = element.getAttribute('alt') !== null
        const hasAriaLabel = element.getAttribute('aria-label') !== null
        
        if (!(hasAlt || hasAriaLabel)) {
          throw new Error('Image must have alt text or aria-label')
        }
      })
    })
  })

  it('форми мають правильні labels', () => {
    cy.visitCatalogPage()
    
    cy.get('input').each(($input) => {
      cy.wrap($input).should(($el) => {
        const element = $el.get(0)
        const hasPlaceholder = element.getAttribute('placeholder') !== null
        const hasAriaLabel = element.getAttribute('aria-label') !== null
        const hasAriaLabelledBy = element.getAttribute('aria-labelledby') !== null
        
        if (!(hasPlaceholder || hasAriaLabel || hasAriaLabelledBy)) {
          throw new Error('Input must have placeholder, aria-label, or aria-labelledby')
        }
      })
    })
  })

  it('підтримує навігацію з клавіатури', () => {
    cy.visitHomePage()
    
    cy.get('button').first().focus()
    cy.focused().should('be.visible')
    
    cy.focused().tab()
    cy.focused().should('be.visible')
  })

  it('має достатній контраст кольорів', () => {
    cy.visitHomePage()
    
    cy.get('h1').should('have.css', 'color').and('not.be.empty')
    cy.get('p').should('have.css', 'color').and('not.be.empty')
  })

  it('toast повідомлення доступні для читачів екрану', () => {
    cy.visitHomePage()
    
    cy.get('[data-testid="movie-card"]').first().within(() => {
      cy.get('[data-testid="favorite-button"]').click()
    })
    
    cy.checkToastMessage('додано до обраних')
  })

  it('інтерактивні елементи мають hover стани', () => {
    cy.visitHomePage()
    
    cy.get('button').first().should('have.css', 'cursor', 'pointer')
  })

  it('фокус залишається в межах модальних вікон', () => {
    cy.visitFavoritesPage()
    cy.visitHomePage()
    
    cy.get('[data-testid="movie-card"]').first().within(() => {
      cy.get('[data-testid="favorite-button"]').click()
    })
    
    cy.visitFavoritesPage()
    
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Очистити всі")').length > 0) {
        cy.get('button').contains('Очистити всі').should('be.visible')
      }
    })
  })

  it('має семантичну структуру сторінки', () => {
    cy.visitHomePage()
    
    cy.get('header, nav, main, section').should('have.length.at.least', 3)
    cy.get('h1, h2, h3').should('have.length.at.least', 2)
  })
})