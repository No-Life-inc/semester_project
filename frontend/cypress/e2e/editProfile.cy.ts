describe('Login and Edit Details', () => {
  beforeEach(() => {
    // Log in and verify the token is in localStorage
    cy.visit('/login');
    cy.get('[data-testid="login-email-input"]').type('test@test.com');
    cy.get('[data-testid="login-password-input"]').type('YourStrongPassword123');
    cy.get('[data-testid="login-submit-button"]').click();

    // Verify successful login and token storage
    cy.url().should('eq', 'http://localhost:3000/');
    cy.window().then((window) => {
      const token = window.localStorage.getItem('token');
      expect(token).to.exist;
    });



  });

  it('displays the correct profile name', () => {
    
    cy.visit('/profile');
    cy.url().should('include', '/profile');
    cy.get('[data-testid="profile-name"]').should('have.text', 'Name: Test Testsen');

    cy.get('[data-testid="edit-profile-button"]').click();
    cy.url().should('include', '/edit-user');

    cy.get('[data-testid="edit-profile-name-input"]').should('have.value', 'Test Testsen');

    cy.get('[data-testid="edit-profile-name-input"]').clear().type('Test Edited');
    cy.get('[data-testid="save-profile-changes-button"]').click();

    cy.get('[data-testid="edit-profile-success"]').should('have.text', 'User details updated successfully!');

    cy.get('[data-testid="return-to-profile-button"]').click();
    cy.url().should('include', '/profile');

    cy.get('[data-testid="profile-name"]').should('have.text', 'Name: Test Edited');

    cy.get('[data-testid="edit-profile-button"]').click();
    cy.url().should('include', '/edit-user');

    cy.get('[data-testid="edit-profile-name-input"]').should('have.value', 'Test Edited');

    cy.get('[data-testid="edit-profile-name-input"]').clear().type('Test Testsen');
    cy.get('[data-testid="save-profile-changes-button"]').click();

    cy.get('[data-testid="edit-profile-success"]').should('have.text', 'User details updated successfully!');

    cy.get('[data-testid="return-to-profile-button"]').click();
    cy.url().should('include', '/profile');

    cy.get('[data-testid="profile-name"]').should('have.text', 'Name: Test Testsen');

    cy.get('[data-testid="navbar-logout-button"]').click();
  });
});

it('displays the correct profile email', () => {
  
  cy.visit('/profile');
  cy.url().should('include', '/profile');
  cy.get('[data-testid="profile-email"]').should('have.text', 'Email: test@test.com');

  cy.get('[data-testid="edit-profile-button"]').click();
  cy.url().should('include', '/edit-user');

  cy.get('[data-testid="edit-profile-email-input"]').should('have.value', 'test@test.com');

  cy.get('[data-testid="edit-profile-email-input"]').clear().type('test@tost.com');
  cy.get('[data-testid="save-profile-changes-button"]').click();

  cy.get('[data-testid="edit-profile-success"]').should('have.text', 'User details updated successfully!');

  cy.get('[data-testid="return-to-profile-button"]').click();

  cy.url().should('include', '/profile');

  cy.get('[data-testid="profile-email"]').should('have.text', 'Email: test@tost.com');
});
