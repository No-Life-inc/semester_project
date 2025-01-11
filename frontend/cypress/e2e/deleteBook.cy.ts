describe('Login and Edit Details', () => {
    beforeEach(() => {
  
      cy.clearLocalStorage();
      cy.clearCookies();
  
      cy.visit('/login');
      cy.get('[data-testid="login-email-input"]').type('test@test.com');
      cy.get('[data-testid="login-password-input"]').type('YourStrongPassword123');
      cy.get('[data-testid="login-submit-button"]').click();
  
   
      cy.url().should('eq', 'http://localhost:3000/');
      cy.window().then((window) => {
        const token = window.localStorage.getItem('token');
        expect(token).to.exist;
      });
    });

    it('should remove a book successfully', () => {
        cy.visit('/profile');
        cy.url().should('include', '/profile');
        cy.get('[data-testid="book-3"]').should('exist');
        cy.contains('My Evil Mother: A Short Story3')

        cy.get('[data-testid="remove-book-3"]').click();

        cy.get('[data-testid="book-3"]').should('not.exist');

        cy.visit('/books');

        cy.get('[data-testid="search-books-input"]').type('My Evil Mother: A Short Story3');

        cy.get('[data-testid="collection-selector-3"]').select('Collection 3');
        cy.get('[data-testid="add-to-collection-button-3"]').click();

    });  

});