import { defineConfig } from "cypress";

describe('Register Page', () => {
  let uniqueEmail;

  beforeEach(() => {
    // Generer en unik e-mail til hver test
    const timestamp = Date.now();
    uniqueEmail = `user${timestamp}@test.com`;

    // Start ved at besøge registreringssiden
    cy.visit('/register');
  });

  it('should register a user successfully', () => {
    // Intercept API-kald for at verificere, at anmodningen sendes korrekt
    cy.intercept('POST', 'http://localhost:5000/v1/user/register').as('registerRequest');

    // Udfyld formularen
    cy.get('[data-testid="register-name-input"]').type('Hans');
    cy.get('[data-testid="register-email-input"]').type(uniqueEmail);
    cy.get('[data-testid="register-password-input"]').type('Password123');

    // Indsend formularen
    cy.get('[data-testid="register-submit-button"]').click();

    // Vent på, at API-anmodningen fuldføres, og verificér svaret
    cy.wait('@registerRequest').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
      expect(interception.request.body).to.deep.equal({
        name: 'Hans',
        email: uniqueEmail,
        password: 'Password123',
      });
    });

    // Kontroller, at success-beskeden vises
    cy.get('[data-testid="register-message"]').should('contain', 'Registration successful');
  });

  it('should show an error message on failed registration', () => {

    cy.get('[data-testid="register-name-input"]').type('Hans');
    cy.get('[data-testid="register-email-input"]').type('h@h.com');
    cy.get('[data-testid="register-password-input"]').type('Password123');
    cy.get('[data-testid="register-submit-button"]').click();

    cy.get('[data-testid="register-message"]').should('contain', 'Email is already in use.');

  });
});
