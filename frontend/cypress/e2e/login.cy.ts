/// <reference types="cypress" />

describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login');
    });
  
    it('should redirect to home page after successful login', () => {
     
      cy.intercept('POST', 'http://localhost:5000/v1/user/login').as('loginRequest');
  
      cy.get('[data-testid="login-email-input"]').type('test_email@example.com');
      cy.get('[data-testid="login-password-input"]').type('YourStrongPassword123');
  
      cy.get('[data-testid="login-submit-button"]').click();
  
      
      cy.wait('@loginRequest').then((interception) => {
        expect(interception.response?.statusCode).to.equal(200);
        expect(interception.request.body).to.deep.equal({
          email: 'test_email@example.com',
          password: 'YourStrongPassword123',
        });
  
      
        const responseBody = interception.response?.body;
        expect(responseBody).to.have.property('token');
        expect(responseBody).to.have.property('user');
        expect(localStorage.getItem('token')).to.equal(responseBody.token);
      });
  
      cy.url().should('eq', `${Cypress.config().baseUrl}`);
      cy.contains('Welcome to our website').should('be.visible');
    });
  
    it('should display an error message on invalid credentials', () => {
      cy.intercept('POST', 'http://localhost:5000/v1/user/login', {
        statusCode: 401,
        body: { error: 'Invalid email or password.' },
      }).as('loginRequest');
  
      cy.get('[data-testid="login-email-input"]').type('test_email@example.com');
      cy.get('[data-testid="login-password-input"]').type('Password123');
  
      cy.get('[data-testid="login-submit-button"]').click();
  
      cy.wait('@loginRequest');
  
      cy.get('[data-testid="login-message"]').should('contain', 'Invalid email or password.');
    });
  
    it('should handle a server error gracefully', () => {
      cy.intercept('POST', 'http://localhost:5000/v1/user/login', {
        statusCode: 500,
        body: { error: 'Internal server error' },
      }).as('loginRequest');
  
      cy.get('[data-testid="login-email-input"]').type('test_email@example.com');
      cy.get('[data-testid="login-password-input"]').type('Password123');
  
      cy.get('[data-testid="login-submit-button"]').click();
  
      cy.wait('@loginRequest');
  
      cy.get('[data-testid="login-message"]').should('contain', 'An error occurred during login. Please try again.');
    });
  });
  