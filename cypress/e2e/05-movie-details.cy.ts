describe('Деталі фільму', () => {
  beforeEach(() => {
    cy.visitCatalogPage()
    cy.get('[data-testid="movie-card"]').first().within(() => {
      cy.get('button').contains('Деталі').click()
    })
  })

  it('відображає основну інформацію про фільм', () => {
    cy.get('h1').should('be.visible')
    cy.get('button').contains('Назад').should('be.visible')
  })

  it('показує постер фільму або fallback іконку', () => {
    cy.get('img, [class*="PosterFallback"]').should('be.visible')
  })

  it('відображає метадані фільму', () => {
    cy.get('span').contains('📅').parent().should('be.visible')
    cy.get('span').contains('⏱️').parent().should('be.visible')
    cy.get('span').contains('🎬').parent().should('be.visible')
  })

  it('показує рейтинги якщо доступні', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[class*="RatingItem"]').length > 0) {
        cy.get('[class*="RatingItem"]').should('be.visible')
        cy.get('.rating-value').should('be.visible')
        cy.get('.rating-source').should('be.visible')
      }
    })
  })

  it('дозволяє додати фільм до обраних', () => {
    cy.get('button').contains('Додати до обраних').click()
    cy.checkToastMessage('додано до обраних')
    cy.get('button').contains('Видалити з обраних').should('be.visible')
  })

  it('дозволяє видалити фільм з обраних', () => {
    cy.get('button').contains('Додати до обраних').click()
    cy.wait(500)
    cy.get('button').contains('Видалити з обраних').click()
    cy.checkToastMessage('видалено з обраних')
    cy.get('button').contains('Додати до обраних').should('be.visible')
  })

  it('показує детальну інформацію', () => {
    cy.get('h2').contains('Детальна інформація').should('be.visible')
    cy.get('h3').contains('Жанри').should('be.visible')
    cy.get('h3').contains('Режисер').should('be.visible')
    cy.get('h3').contains('Акторський склад').should('be.visible')
  })

  it('показує жанри як теги', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[class*="GenreTag"]').length > 0) {
        cy.get('[class*="GenreTag"]').should('be.visible')
      }
    })
  })

  it('показує список акторів', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[class*="ActorItem"]').length > 0) {
        cy.get('[class*="ActorItem"]').should('be.visible')
      }
    })
  })

  it('повертається назад при кліку на кнопку "Назад"', () => {
    cy.get('button').contains('Назад').click()
    cy.url().should('not.include', '/movie/')
  })

  it('показує skeleton завантажувач під час завантаження', () => {
    cy.intercept('GET', 'https://www.omdbapi.com/**', {
      delay: 2000,
      fixture: 'movie-details.json'
    }).as('getMovieDetails')
    
    cy.reload()
    cy.get('div').should('contain', 'Завантаження деталей фільму')
  })

  it('показує помилку при невдалому завантаженні', () => {
    cy.intercept('GET', 'https://www.omdbapi.com/**', {
      statusCode: 500,
      body: { Response: 'False', Error: 'Internal Server Error' }
    }).as('getMovieError')
    
    cy.reload()
    cy.get('h2').contains('Помилка завантаження').should('be.visible')
    cy.get('button').contains('Повернутися назад').should('be.visible')
  })

  it('працює на мобільних пристроях', () => {
    cy.viewport('iphone-x')
    cy.get('h1').should('be.visible')
    cy.get('button').contains('Назад').should('be.visible')
    cy.get('button').contains(/Додати до обраних|Видалити з обраних/).should('be.visible')
  })
})