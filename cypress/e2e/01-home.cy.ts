describe('Головна сторінка', () => {
  beforeEach(() => {
    cy.visitHomePage()
  })

  it('відображає правильний заголовок та опис', () => {
    cy.get('h1').should('contain', 'Відкрийте дивовижне кіно')
    cy.get('p').should('contain', 'Досліджуйте тисячі фільмів')
  })

  it('показує навігаційне меню', () => {
    cy.get('nav').should('be.visible')
    cy.get('nav').should('contain', 'Головна')
    cy.get('nav').should('contain', 'Каталог')
  })

  it('показує кнопку обраних фільмів', () => {
    cy.get('[data-testid="favorites-button"]').should('be.visible')
    cy.get('[data-testid="favorites-button"]').should('contain', 'Обрані')
  })

  it('відображає інформацію про кількість обраних фільмів', () => {
    cy.get('[data-testid="favorites-info"]').should('be.visible')
    cy.get('[data-testid="favorites-info"]').should('contain', 'фільм')
  })

  it('навігує до каталогу при кліку на кнопку', () => {
    cy.get('button').contains('Дослідити каталог фільмів').click()
    cy.url().should('include', '/catalog')
  })

  it('показує рекомендовані фільми', () => {
    cy.get('h2').contains('Рекомендовані фільми').should('be.visible')
    cy.get('[data-testid="movie-card"]').should('have.length.at.least', 1)
  })

  it('дозволяє переглянути деталі фільму', () => {
    cy.get('[data-testid="movie-card"]').first().within(() => {
      cy.get('button').contains('Деталі').click()
    })
    cy.url().should('include', '/movie/')
  })

  it('дозволяє додати фільм до обраних', () => {
    cy.get('[data-testid="movie-card"]').first().within(() => {
      cy.get('[data-testid="favorite-button"]').click()
    })
    cy.checkToastMessage('додано до обраних')
    cy.get('[data-testid="favorites-badge"]').should('contain', '1')
  })
})