describe('Search Books (Live API)', () => {
  beforeEach(() => {
    // Log in and verify the token is in localStorage
    cy.visit('/login');
    cy.get('[data-testid="login-email-input"]').type('b@b.dk');
    cy.get('[data-testid="login-password-input"]').type('Test12345');
    cy.get('[data-testid="login-submit-button"]').click();

    // Verify successful login and token storage
    cy.url().should('eq', 'http://localhost:3000/');
    cy.window().then((window) => {
      const token = window.localStorage.getItem('token');
      expect(token).to.exist;
    });

    // Navigate to /books
    cy.visit('/books');
    cy.url().should('include', '/books');
  });

  it('should search for books and display matching results', () => {
    // Ensure search input is visible
    cy.get('[data-testid="search-books-input"]').should('be.visible');

    // Enter a search query
    cy.get('[data-testid="search-books-input"]').type('Court');

    cy.wait(500);

    // Verify results
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
    // Enter an invalid search query
    cy.get('[data-testid="search-books-input"]').type('NonExistentBookTitle');

    cy.wait(500);

    // Verify no books are displayed
    cy.get('[data-testid="book-list"]')
      .find('[data-testid^="book-card-"]')
      .should('not.exist');

  });
});
