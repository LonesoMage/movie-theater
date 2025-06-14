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
    cy.intercept('GET', '**/omdbapi.com/**', { delay: 2000 }).as('getMovies')
    cy.reload()
    
    cy.get('div').contains('Завантаження').should('be.visible')
    cy.wait('@getMovies')
  })

  it('показує повідомлення про помилку при невдалому запиті', () => {
    cy.intercept('GET', '**/omdbapi.com/**', { statusCode: 500 }).as('getMoviesError')
    cy.reload()
    cy.wait('@getMoviesError')
    cy.get('div').contains('Упс! Щось пішло не так').should('be.visible')
    cy.get('button').contains('Спробувати знову').should('be.visible')
  })

  it('показує порожній стан коли немає результатів', () => {
    cy.get('input[placeholder*="Пошук за назвою"]').type('фільмякогонеіснує123456')
    cy.get('button').contains('Знайти').click()
    
    cy.get('div').should(($el) => {
      const text = $el.text()
      expect(text).to.match(/Нічого не знайдено|порожня/)
    })
    cy.get('button').contains('Очистити').should('be.visible')
  })

  it('працює пагінація', () => {
    cy.get('input[placeholder*="Пошук за назвою"]').type('movie')
    cy.get('button').contains('Знайти').click()
    
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("2")').length > 0) {
        cy.get('button').contains('2').click()
        cy.get('button').contains('→').should('be.visible')
        cy.get('button').contains('←').should('be.visible')
      }
    })
  })
})