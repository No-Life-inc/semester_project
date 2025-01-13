import { defineConfig } from "cypress";

describe('Register Page', () => {
  let uniqueEmail;

  beforeEach(() => {
    const timestamp = Date.now();
    uniqueEmail = `user${timestamp}@test.com`;

    cy.visit('/register');
  });

  it('should register a user successfully', () => {
    cy.intercept('POST', 'http://localhost:5000/v1/user/register').as('registerRequest');

    cy.get('[data-testid="register-name-input"]').type('Hans');
    cy.get('[data-testid="register-email-input"]').type(uniqueEmail);
    cy.get('[data-testid="register-password-input"]').type('Password123');

    cy.get('[data-testid="register-submit-button"]').click();

    cy.wait('@registerRequest').then((interception) => {
      expect(interception.response?.statusCode).to.equal(201);
      expect(interception.request.body).to.deep.equal({
        name: 'Hans',
        email: uniqueEmail,
        password: 'Password123',
      });
    });

    cy.get('[data-testid="register-message"]').should('contain', 'Registration successful');
  });

  it('should show an error message if email is in use', () => {

    cy.get('[data-testid="register-name-input"]').type('Hans');
    cy.get('[data-testid="register-email-input"]').type('test@test.com');
    cy.get('[data-testid="register-password-input"]').type('YourStrongPassword123');
    cy.get('[data-testid="register-submit-button"]').click();

    cy.get('[data-testid="register-message"]').should('contain', 'Email is already in use.');

  });

  it('should show an error message if invalid characters in name', () => {
  
    cy.get('[data-testid="register-name-input"]').type('Betül');
    cy.get('[data-testid="register-email-input"]').type('h@h.com');
    cy.get('[data-testid="register-password-input"]').type('YourStrongPassword123');
    cy.get('[data-testid="register-submit-button"]').click();
  
    cy.get('[data-testid="register-message"]').should('contain', 'Invalid characters in name.');
  
  });
});




