/// <reference types="cypress" />

describe('Login Page', () => {
    beforeEach(() => {
      // Start by visiting the login page
      cy.visit('/login');
    });
  
    it('should redirect to home page after successful login', () => {
      // Intercept API call to verify the request is sent correctly
      cy.intercept('POST', 'http://localhost:5000/v1/user/login').as('loginRequest');
  
      // Fill out the form
      cy.get('[data-testid="login-email-input"]').type('test_email@example.com');
      cy.get('[data-testid="login-password-input"]').type('YourStrongPassword123');
  
      // Submit the form
      cy.get('[data-testid="login-submit-button"]').click();
  
      // Wait for the API request to complete and verify the response
      cy.wait('@loginRequest').then((interception) => {
        expect(interception.response?.statusCode).to.equal(200);
        expect(interception.request.body).to.deep.equal({
          email: 'test_email@example.com',
          password: 'YourStrongPassword123',
        });
  
        // Check that token is stored in localStorage
        const responseBody = interception.response?.body;
        expect(responseBody).to.have.property('token');
        expect(responseBody).to.have.property('user');
        expect(localStorage.getItem('token')).to.equal(responseBody.token);
      });
  
      // Verify redirection to the home page
      cy.url().should('eq', `${Cypress.config().baseUrl}`);
      cy.contains('Welcome to our website').should('be.visible');
    });
  
    it('should display an error message on invalid credentials', () => {
      // Intercept API call to mock a failed login
      cy.intercept('POST', 'http://localhost:5000/v1/user/login', {
        statusCode: 401,
        body: { error: 'Invalid email or password.' },
      }).as('loginRequest');
  
      // Fill out the form
      cy.get('[data-testid="login-email-input"]').type('test_email@example.com');
      cy.get('[data-testid="login-password-input"]').type('Password123');
  
      // Submit the form
      cy.get('[data-testid="login-submit-button"]').click();
  
      // Wait for the API request to complete
      cy.wait('@loginRequest');
  
      // Verify that the error message is displayed
      cy.get('[data-testid="login-message"]').should('contain', 'Invalid email or password.');
    });
  
    it('should handle a server error gracefully', () => {
      // Intercept API call to mock a server error
      cy.intercept('POST', 'http://localhost:5000/v1/user/login', {
        statusCode: 500,
        body: { error: 'Internal server error' },
      }).as('loginRequest');
  
      // Fill out the form
      cy.get('[data-testid="login-email-input"]').type('test_email@example.com');
      cy.get('[data-testid="login-password-input"]').type('Password123');
  
      // Submit the form
      cy.get('[data-testid="login-submit-button"]').click();
  
      // Wait for the API request to complete
      cy.wait('@loginRequest');
  
      // Verify that a generic error message is displayed
      cy.get('[data-testid="login-message"]').should('contain', 'An error occurred during login. Please try again.');
    });
  });
  