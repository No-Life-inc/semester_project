// /// <reference types="cypress" />

// describe('Add Book to Collection (Live API)', () => {
//     beforeEach(() => {
//       cy.visit('/login');
//       cy.get('[data-testid="login-email-input"]').type('test_email@example.com');
//       cy.get('[data-testid="login-password-input"]').type('YourStrongPassword123');
//       cy.get('[data-testid="login-submit-button"]').click();
  
//       cy.url().should('eq', 'http://localhost:3000/');
//       cy.window().then((window) => {
//         const token = window.localStorage.getItem('token');
//         expect(token).to.exist;
//       });
  
//       cy.visit('/books');
//     });
  
//     it('should allow the user to add a book to a collection', () => {
//       cy.get('[data-testid="book-list"]').should('be.visible');
  
//       cy.get('[data-testid^="book-card-"]').first().within(() => {
//         cy.get('[data-testid^="collection-selector-"]')
//           .find('option:not(:disabled)')
//           .then((options) => {
//             const collectionOptions = [...options].map((option) => (option as HTMLOptionElement).value);
//             const randomCollection = collectionOptions[Math.floor(Math.random() * collectionOptions.length)];
//             cy.get('[data-testid^="collection-selector-"]').select(randomCollection);
//           });
  
//         cy.get('[data-testid^="add-to-collection-button-"]').click();
//       });
  
//       cy.window().then((window) => {
//         const token = window.localStorage.getItem('token');
//         expect(token).to.exist;
//       });
//     });
  
//     it('should not allow adding a book without selecting a collection', () => {
//         cy.get('[data-testid="book-list"]').should('be.visible');
      
//         cy.get('[data-testid^="book-card-"]').first().within(() => {
//           cy.get('[data-testid^="add-to-collection-button-"]').click();
//         });
      
//         cy.intercept('POST', '/v1/collection/addBook').as('addBookRequest');
//         cy.wait(500);
//         cy.get('@addBookRequest').should('not.exist');
//       });
//   });

/// <reference types="cypress" />

describe('Add Book to Collection', () => {
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
  
    it('should allow the user to add a book to a collection', () => {
      cy.get('[data-testid="book-list"]').should('be.visible');
  
      cy.get('[data-testid^="book-card-"]').first().within(() => {
        cy.get('[data-testid^="collection-selector-"]')
          .find('option:not(:disabled)')
          .then((options) => {
            const collectionOptions = [...options].map((option) => (option as HTMLOptionElement).value);
            const randomCollection = collectionOptions[Math.floor(Math.random() * collectionOptions.length)];
            cy.get('[data-testid^="collection-selector-"]').select(randomCollection);
          });
  
        cy.get('[data-testid^="add-to-collection-button-"]').click();
      });
  
      cy.get('[data-testid="error-message"]').should('not.exist');
    });
  
    it('should display an error message if no collection is selected', () => {
      cy.get('[data-testid="book-list"]').should('be.visible');
  
      cy.get('[data-testid^="book-card-"]').first().within(() => {
        cy.get('[data-testid^="add-to-collection-button-"]').click();
      });
  
      cy.get('[data-testid="error-message"]').should('contain', 'Please select a collection.');
    });
  
    it('should redirect to login if the authorization token is missing', () => {
        cy.window().then((window) => {
          window.localStorage.removeItem('token');
        });
      
        cy.visit('/books');
      
        cy.url().should('eq', 'http://localhost:3000/login');
      
        cy.get('[data-testid="login-form"]').should('be.visible');
      });
  });
  