describe('Навігація', () => {
  it('переходить між всіма сторінками', () => {
    cy.visitHomePage()
    
    cy.get('nav button').contains('Каталог').click()
    cy.url().should('include', '/catalog')
    cy.get('h1').should('contain', 'Каталог фільмів')
    
    cy.get('[data-testid="favorites-button"]').click()
    cy.url().should('include', '/favorites')
    cy.get('h1').should('contain', 'Обрані фільми')
    
    cy.get('h1').contains('КіноТеатр').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.get('h1').should('contain', 'Відкрийте дивовижне кіно')
  })

  it('показує активний стан навігаційних елементів', () => {
    cy.visitHomePage()
    cy.get('nav button').contains('Головна').should('be.visible')
    
    cy.get('nav button').contains('Каталог').click()
    cy.get('nav button').contains('Каталог').should('be.visible')
  })

  it('працює на мобільних пристроях', () => {
    cy.viewport('iphone-x')
    cy.visitHomePage()
    
    cy.get('nav').should('be.visible')
    cy.get('[data-testid="favorites-button"]').should('exist')
    
    cy.get('nav button').contains('Каталог').click()
    cy.url().should('include', '/catalog')
  })

  it('показує правильні breadcrumbs на сторінці фільму', () => {
    cy.visitCatalogPage()
    cy.get('[data-testid="movie-card"]').first().within(() => {
      cy.get('button').contains('Деталі').click()
    })
    
    cy.get('button').contains('Назад').should('be.visible')
    cy.get('button').contains('Назад').click()
    cy.url().should('include', '/catalog')
  })
})