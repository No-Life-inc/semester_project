describe('Search Books (Live API)', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-testid="login-email-input"]').type('test_email@example.com');
    cy.get('[data-testid="login-password-input"]').type('YourStrongPassword123');
    cy.get('[data-testid="login-submit-button"]').click();

    cy.url().should('eq', 'http://localhost:3000/');
    cy.window().then((window) => {
      const token = window.localStorage.getItem('token');
      expect(token).to.exist;
    });

    cy.visit('/books');
  });

  it('should search for books and display matching results', () => {
    cy.get('[data-testid="search-books-input"]').should('be.visible');

    cy.get('[data-testid="search-books-input"]').type('Court');

    cy.wait(500);

    cy.get('[data-testid="book-list"]')
      .find('[data-testid^="book-card-"]')
      .should('exist')
      .then((books) => {
        books.each((index, book) => {
          cy.wrap(book)
            .find('[data-testid^="book-title-"]')
            .invoke('text')
            .should('match', /Court/i);
        });
      });
  });

  it('should show no results if no book matches the search query', () => {
    cy.get('[data-testid="search-books-input"]').type('NonExistentBookTitle');

    cy.wait(500);

    cy.get('[data-testid="book-list"]')
      .find('[data-testid^="book-card-"]')
      .should('not.exist');

  });
});
