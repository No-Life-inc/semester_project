describe('Register Page', () => {
  beforeEach(() => {
    // Start by visiting the register page
    cy.visit('/register');
  });

  it('should register a user successfully', () => {
    // Intercept API call to verify the request is sent correctly
    cy.intercept('POST', 'http://localhost:5000/v1/user/register').as('registerRequest');

    // Fill out the form
    cy.get('[data-testid="register-name-input"]').type('Hans');
    cy.get('[data-testid="register-email-input"]').type('h@h.com');
    cy.get('[data-testid="register-password-input"]').type('Password123');

    // Submit the form
    cy.get('[data-testid="register-submit-button"]').click();

    // Wait for the API request to complete and verify the response
    cy.wait('@registerRequest').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
      expect(interception.request.body).to.deep.equal({
        name: 'Hans',
        email: 'h@h.com',
        password: 'Password123',
      });
    });

    // Check that the success message is displayed
    cy.get('[data-testid="register-message"]').should('contain', 'Registration successful');
  });

  it('should show an error message on failed registration', () => {
    // Intercept API call to mock a failed registration
    cy.intercept('POST', 'http://localhost:5000/v1/user/register', {
      statusCode: 400,
      body: { error: 'Registration failed' },
    }).as('registerRequest');

    // Fill out the form
    cy.get('[data-testid="register-name-input"]').type('Hans');
    cy.get('[data-testid="register-email-input"]').type('h@h.com');
    cy.get('[data-testid="register-password-input"]').type('Password123');

    // Submit the form
    cy.get('[data-testid="register-submit-button"]').click();

    // Wait for the API request to complete
    cy.wait('@registerRequest');

    // Check that the error message is displayed
    cy.get('[data-testid="register-message"]').should('contain', 'An error occurred during registration');
  });
});
