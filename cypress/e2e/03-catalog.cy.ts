describe('Каталог фільмів', () => {
  beforeEach(() => {
    cy.visitCatalogPage()
  })

  it('відображає список фільмів', () => {
    cy.get('[data-testid="movie-card"]').should('have.length.at.least', 1)
    cy.get('span').contains('Показано').should('be.visible')
  })

  it('дозволяє шукати фільми', () => {
    cy.get('input[placeholder*="Пошук за назвою"]').type('Batman')
    cy.get('button').contains('Знайти').click()
    
    cy.get('span').should(($el) => {
      expect($el.text()).to.match(/Результати пошуку|Показано/)
    })
    cy.checkToastMessage('Знайдено')
  })

  it('фільтрує фільми за роком', () => {
    cy.get('input[placeholder*="Наприклад: 2023"]').type('2020')
    cy.get('input[placeholder*="Пошук за назвою"]').type('action')
    cy.get('button').contains('Знайти').click()
    cy.get('[data-testid="movie-card"]').should('exist')
  })

  it('фільтрує за типом контенту', () => {
    cy.get('button').contains('Фільми').click()
    cy.get('[data-testid="movie-card"]').should('exist')
    
    cy.get('button').contains('Серіали').click()
    cy.wait(1000)
  })

  it('очищає фільтри', () => {
    cy.get('input[placeholder*="Пошук за назвою"]').type('Batman')
    cy.get('input[placeholder*="Наприклад: 2023"]').type('2020')
    cy.get('button').contains('Серіали').click()
    
    cy.get('button').contains('Очистити фільтри').click()
    cy.checkToastMessage('Фільтри очищено')
    
    cy.get('input[placeholder*="Пошук за назвою"]').should('have.value', '')
    cy.get('input[placeholder*="Наприклад: 2023"]').should('have.value', '')
  })

  it('показує skeleton завантажувач', () => {
    cy.intercept('GET', 'https://www.omdbapi.com/**', (req) => {
      req.reply((res) => {
        res.setDelay(2000)
        res.send({ fixture: 'movies.json' })
      })
    }).as('getMovies')
    
    cy.reload()
    cy.get('div').should('contain', 'Завантаження')
  })

  it('показує повідомлення про помилку при невдалому запиті', () => {
    cy.intercept('GET', 'https://www.omdbapi.com/**', {
      statusCode: 500,
      body: { Response: 'False', Error: 'Internal Server Error' }
    }).as('getMoviesError')
    
    cy.reload()
    cy.get('div').contains('Упс! Щось пішло не так').should('be.visible')
    cy.get('button').contains('Спробувати знову').should('be.visible')
  })

  it('показує порожній стан коли немає результатів', () => {
    cy.intercept('GET', 'https://www.omdbapi.com/**', {
      body: { Response: 'False', Error: 'Movie not found!' }
    }).as('noResults')
    
    cy.get('input[placeholder*="Пошук за назвою"]').type('фільмякогонеіснує123456')
    cy.get('button').contains('Знайти').click()
    
    cy.wait('@noResults')
    cy.get('[data-testid="empty-state"], div:contains("Нічого не знайдено")').should('be.visible')
  })

  it('працює пагінація', () => {
    cy.intercept('GET', 'https://www.omdbapi.com/**', {
      body: {
        Search: Array(10).fill(null).map((_, i) => ({
          Title: `Test Movie ${i}`,
          Year: '2023',
          imdbID: `tt000000${i}`,
          Type: 'movie',
          Poster: 'https://via.placeholder.com/300x450'
        })),
        totalResults: '25',
        Response: 'True'
      }
    }).as('searchResults')
    
    cy.get('input[placeholder*="Пошук за назвою"]').type('movie')
    cy.get('button').contains('Знайти').click()
    
    cy.wait('@searchResults')
    cy.get('button').contains('2').should('be.visible')
    cy.get('button').contains('→').should('be.visible')
  })
})