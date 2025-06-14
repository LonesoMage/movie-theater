describe('API інтеграція', () => {
  it('успішно завантажує дані з OMDB API', () => {
    cy.intercept('GET', '**/omdbapi.com/**').as('omdbRequest')
    
    cy.visitHomePage()
    cy.wait('@omdbRequest').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200)
    })
  })

  it('обробляє помилки API коректно', () => {
    cy.intercept('GET', '**/omdbapi.com/**', {
      statusCode: 500,
      body: { Response: 'False', Error: 'Internal Server Error' }
    }).as('omdbError')
    
    cy.visitCatalogPage()
    cy.wait('@omdbError')
    cy.get('div').contains('Упс! Щось пішло не так').should('be.visible')
  })

  it('показує правильні дані з API', () => {
    cy.intercept('GET', '**/omdbapi.com/**', { fixture: 'movies.json' }).as('omdbMovies')
    
    cy.visitCatalogPage()
    cy.wait('@omdbMovies')
    
    cy.get('[data-testid="movie-card"]').should('exist')
  })

  it('коректно обробляє пошукові запити', () => {
    cy.intercept('GET', '**/omdbapi.com/**').as('searchRequest')
    
    cy.visitCatalogPage()
    cy.get('input[placeholder*="Пошук за назвою"]').type('Batman')
    cy.get('button').contains('Знайти').click()
    
    cy.wait('@searchRequest').then((interception) => {
      expect(interception.request.url).to.include('s=Batman')
    })
  })

  it('кешує результати пошуку', () => {
    cy.visitCatalogPage()
    
    cy.get('input[placeholder*="Пошук за назвою"]').type('Batman')
    cy.get('button').contains('Знайти').click()
    cy.get('[data-testid="movie-card"]').should('exist')
    
    cy.get('input[placeholder*="Пошук за назвою"]').clear().type('Batman')
    cy.get('button').contains('Знайти').click()
    cy.get('[data-testid="movie-card"]').should('exist')
  })

  it('обробляє тайм-аути API', () => {
    cy.intercept('GET', '**/omdbapi.com/**', { delay: 15000 }).as('slowRequest')
    
    cy.visitCatalogPage()
    cy.get('input[placeholder*="Пошук за назвою"]').type('test')
    cy.get('button').contains('Знайти').click()
    
    cy.get('div', { timeout: 20000 }).should('contain', 'Помилка')
  })

  it('перевіряє API ключ', () => {
    cy.intercept('GET', '**/omdbapi.com/**', {
      statusCode: 401,
      body: { Response: 'False', Error: 'Invalid API key!' }
    }).as('invalidKey')
    
    cy.visitHomePage()
    cy.wait('@invalidKey')
    
    cy.get('div').contains('Помилка').should('be.visible')
  })

  it('обробляє пусті результати пошуку', () => {
    cy.intercept('GET', '**/omdbapi.com/**', {
      body: { Response: 'False', Error: 'Movie not found!' }
    }).as('noResults')
    
    cy.visitCatalogPage()
    cy.get('input[placeholder*="Пошук за назвою"]').type('неіснуючийфільм123')
    cy.get('button').contains('Знайти').click()
    cy.wait('@noResults')
    
    cy.get('div').should(($el) => {
      const text = $el.text()
      expect(text).to.match(/Нічого не знайдено|порожня/)
    })
  })
})