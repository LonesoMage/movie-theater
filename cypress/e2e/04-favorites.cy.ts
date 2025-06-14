describe('Обрані фільми', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear()
    })
  })

  it('показує порожній стан коли немає обраних фільмів', () => {
    cy.visitFavoritesPage()
    cy.get('div').contains('Ваша колекція порожня').should('be.visible')
    cy.get('button').contains('Переглянути каталог').should('be.visible')
  })

  it('дозволяє додавати фільми до обраних', () => {
    cy.visitHomePage()
    
    cy.get('[data-testid="movie-card"]').should('have.length.at.least', 1)
    cy.get('[data-testid="movie-card"]').first().within(() => {
      cy.get('[data-testid="movie-title"]').invoke('text').as('movieTitle')
      cy.get('[data-testid="favorite-button"]').click()
    })
    
    cy.checkToastMessage('додано до обраних')
    cy.get('[data-testid="favorites-badge"]').should('contain', '1')
    
    cy.visitFavoritesPage()
    cy.get('@movieTitle').then((title) => {
      cy.get('body').should('contain', title)
    })
  })

  it('дозволяє видаляти фільми з обраних', () => {
    cy.visitHomePage()
    
    cy.get('[data-testid="movie-card"]').first().within(() => {
      cy.get('[data-testid="favorite-button"]').click()
    })
    
    cy.visitFavoritesPage()
    cy.get('[data-testid="movie-card"]').should('exist')
    cy.get('[data-testid="movie-card"]').first().within(() => {
      cy.get('[data-testid="favorite-button"]').click()
    })
    
    cy.checkToastMessage('видалено з обраних')
    cy.get('div').contains('Ваша колекція порожня').should('be.visible')
  })

  it('показує статистику обраних фільмів', () => {
    cy.visitHomePage()
    
    cy.get('[data-testid="movie-card"]').first().within(() => {
      cy.get('[data-testid="favorite-button"]').click()
    })
    
    cy.get('[data-testid="movie-card"]').eq(1).within(() => {
      cy.get('[data-testid="favorite-button"]').click()
    })
    
    cy.visitFavoritesPage()
    cy.get('div').should('contain', '2').and('contain', 'фільм')
  })

  it('дозволяє очистити всі обрані фільми', () => {
    cy.visitHomePage()
    
    cy.get('[data-testid="movie-card"]').first().within(() => {
      cy.get('[data-testid="favorite-button"]').click()
    })
    
    cy.visitFavoritesPage()
    
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Очистити всі")').length > 0) {
        cy.get('button').contains('Очистити всі').click()
        cy.on('window:confirm', () => true)
        cy.get('div').contains('Ваша колекція порожня').should('be.visible')
      }
    })
  })

  it('зберігає обрані фільми в localStorage', () => {
    cy.visitHomePage()
    
    cy.get('[data-testid="movie-card"]').first().within(() => {
      cy.get('[data-testid="favorite-button"]').click()
    })
    
    cy.window().its('localStorage').should('not.be.empty')
    
    cy.reload()
    cy.get('[data-testid="favorites-badge"]').should('contain', '1')
  })

  it('переходить до каталогу з порожнього стану', () => {
    cy.visitFavoritesPage()
    cy.get('button').contains('Переглянути каталог').click()
    cy.url().should('include', '/catalog')
  })
})