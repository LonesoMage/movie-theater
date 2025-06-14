/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      visitHomePage(): Chainable<void>
      visitCatalogPage(): Chainable<void>
      visitFavoritesPage(): Chainable<void>
      searchMovie(query: string): Chainable<void>
      addToFavorites(movieTitle: string): Chainable<void>
      removeFromFavorites(movieTitle: string): Chainable<void>
      clearAllFavorites(): Chainable<void>
      checkToastMessage(message: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('visitHomePage', () => {
  cy.visit('/')
  cy.get('h1').should('contain', 'Відкрийте дивовижне кіно')
})

Cypress.Commands.add('visitCatalogPage', () => {
  cy.visit('/catalog')
  cy.get('h1').should('contain', 'Каталог фільмів')
})

Cypress.Commands.add('visitFavoritesPage', () => {
  cy.visit('/favorites')
  cy.get('h1').should('contain', 'Обрані фільми')
})

Cypress.Commands.add('searchMovie', (query: string) => {
  cy.get('input[placeholder*="Пошук за назвою"]').type(query)
  cy.get('button').contains('Знайти').click()
})

Cypress.Commands.add('addToFavorites', (movieTitle: string) => {
  cy.get('[data-testid="movie-card"]')
    .contains(movieTitle)
    .closest('[data-testid="movie-card"]')
    .find('[data-testid="favorite-button"]')
    .click()
})

Cypress.Commands.add('removeFromFavorites', (movieTitle: string) => {
  cy.get('[data-testid="movie-card"]')
    .contains(movieTitle)
    .closest('[data-testid="movie-card"]')
    .find('[data-testid="favorite-button"]')
    .click()
})

Cypress.Commands.add('clearAllFavorites', () => {
  cy.get('button').contains('Очистити всі').click()
  cy.get('button').contains('OK').click()
})

Cypress.Commands.add('checkToastMessage', (message: string) => {
  cy.contains(message).should('be.visible')
})

export {}