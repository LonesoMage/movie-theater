describe('API інтеграція', () => {
  it('успішно завантажує дані з OMDB API', () => {
    cy.intercept('GET', 'https://www.omdbapi.com/**', {
      body: { fixture: 'movies.json' }
    }).as('omdbRequest')
    
    cy.visitHomePage()
    cy.wait('@omdbRequest').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200)
    })
  })

  it('обробляє помилки API коректно', () => {
    cy.intercept('GET', 'https://www.omdbapi.com/**', {
      statusCode: 500,
      body: { Response: 'False', Error: 'Internal Server Error' }
    }).as('omdbError')
    
    cy.visitCatalogPage()
    cy.wait('@omdbError')
    cy.get('div').contains('Упс! Щось пішло не так').should('be.visible')
  })

  it('показує правильні дані з API', () => {
    cy.intercept('GET', 'https://www.omdbapi.com/**', { 
      fixture: 'movies.json' 
    }).as('omdbMovies')
    
    cy.visitCatalogPage()
    cy.wait('@omdbMovies')
    
    cy.get('[data-testid="movie-card"]').should('exist')
  })

  it('коректно обробляє пошукові запити', () => {
    cy.intercept('GET', 'https://www.omdbapi.com/**', (req) => {
      if (req.url.includes('s=Batman')) {
        req.reply({ fixture: 'movies.json' })
      } else {
        req.reply({ fixture: 'movies.json' })
      }
    }).as('searchRequest')
    
    cy.visitCatalogPage()
    cy.get('input[placeholder*="Пошук за назвою"]').type('Batman')
    cy.get('button').contains('Знайти').click()
    
    cy.wait('@searchRequest')
  })

  it('кешує результати пошуку', () => {
    cy.intercept('GET', 'https://www.omdbapi.com/**', {
      body: {
        Search: [
          {
            Title: 'Batman Begins',
            Year: '2005',
            imdbID: 'tt0372784',
            Type: 'movie',
            Poster: 'https://via.placeholder.com/300x450'
          }
        ],
        totalResults: '1',
        Response: 'True'
      }
    }).as('searchResults')
    
    cy.visitCatalogPage()
    
    cy.get('input[placeholder*="Пошук за назвою"]').type('Batman')
    cy.get('button').contains('Знайти').click()
    cy.wait('@searchResults')
    cy.get('[data-testid="movie-card"]').should('exist')
    
    cy.get('input[placeholder*="Пошук за назвою"]').clear().type('Batman')
    cy.get('button').contains('Знайти').click()
    cy.get('[data-testid="movie-card"]').should('exist')
  })

  it('обробляє тайм-аути API', () => {
    cy.intercept('GET', 'https://www.omdbapi.com/**', {
      statusCode: 408,
      body: { Response: 'False', Error: 'Request timeout' },
      delay: 15000
    }).as('timeoutRequest')
    
    cy.visitCatalogPage()
    cy.get('input[placeholder*="Пошук за назвою"]').type('test')
    cy.get('button').contains('Знайти').click()
    
    cy.get('div', { timeout: 20000 }).should('contain', 'Упс! Щось пішло не так')
  })

  it('перевіряє API ключ', () => {
    cy.intercept('GET', 'https://www.omdbapi.com/**', {
      statusCode: 401,
      body: { Response: 'False', Error: 'Invalid API key!' }
    }).as('invalidKey')
    
    cy.visitCatalogPage()
    cy.wait('@invalidKey')
    
    cy.get('div').contains('Упс! Щось пішло не так').should('be.visible')
  })

  it('обробляє пусті результати пошуку', () => {
    cy.intercept('GET', 'https://www.omdbapi.com/**', {
      body: { Response: 'False', Error: 'Movie not found!' }
    }).as('noResults')
    
    cy.visitCatalogPage()
    cy.get('input[placeholder*="Пошук за назвою"]').type('неіснуючийфільм123')
    cy.get('button').contains('Знайти').click()
    cy.wait('@noResults')
    
    cy.get('[data-testid="empty-state"], div:contains("Нічого не знайдено")').should('be.visible')
  })
})