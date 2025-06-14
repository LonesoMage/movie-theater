describe('Responsive дизайн', () => {
  const viewports = [
    { device: 'iphone-x', width: 375, height: 812 },
    { device: 'ipad-mini', width: 768, height: 1024 },
    { device: 'macbook-13', width: 1280, height: 800 }
  ]

  viewports.forEach(({ device, width, height }) => {
    describe(`На пристрої ${device} (${width}x${height})`, () => {
      beforeEach(() => {
        cy.viewport(width, height)
      })

      it('коректно відображає головну сторінку', () => {
        cy.visitHomePage()
        cy.get('h1').should('be.visible')
        cy.get('nav').should('be.visible')
        cy.get('[data-testid="favorites-button"]').scrollIntoView().should('be.visible')
      })

      it('коректно відображає каталог', () => {
        cy.visitCatalogPage()
        cy.get('h1').should('be.visible')
        cy.get('input[placeholder*="Пошук"]').should('be.visible')
        cy.get('[data-testid="movie-card"]').should('be.visible')
      })

      it('коректно відображає сторінку фільму', () => {
        cy.visitCatalogPage()
        cy.get('[data-testid="movie-card"]').first().within(() => {
          cy.get('button').contains('Деталі').click()
        })
        
        cy.get('h1').should('be.visible')
        cy.get('button').contains('Назад').should('be.visible')
      })

      it('навігація працює на всіх розмірах', () => {
        cy.visitHomePage()
        cy.get('nav button').contains('Каталог').click()
        cy.url().should('include', '/catalog')
        
        cy.get('[data-testid="favorites-button"]').scrollIntoView().click()
        cy.url().should('include', '/favorites')
      })

      if (device === 'iphone-x') {
        it('приховує непотрібні елементи на мобільному', () => {
          cy.visitHomePage()
          cy.get('[data-testid="movie-card"]').first().within(() => {
            cy.get('[data-testid="favorite-button"]').click()
          })
          
          cy.visitFavoritesPage()
          cy.get('[data-testid="favorites-info"]').should('not.be.visible')
        })
      }
    })
  })

  it('коректно адаптується при зміні розміру вікна', () => {
    cy.visitHomePage()
    cy.viewport(1280, 800)
    cy.get('[data-testid="favorites-info"]').should('be.visible')
    
    cy.viewport(375, 812)
    cy.get('h1').should('be.visible')
    cy.get('nav').should('be.visible')
  })
})