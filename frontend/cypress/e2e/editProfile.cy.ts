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

  it('displays the changed profile name', () => {
    
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

  });

it('displays error message if name is invalid', () => {
  
  cy.visit('/profile');
  cy.url().should('include', '/profile');

  cy.get('[data-testid="edit-profile-button"]').click();
  cy.url().should('include', '/edit-user');

  cy.get('[data-testid="edit-profile-name-input"]').should('have.value', 'Test Testsen');

  cy.get('[data-testid="edit-profile-name-input"]').clear().type(' ');
  cy.get('[data-testid="save-profile-changes-button"]').click();

  cy.get('[data-testid="edit-profile-error"]').should('have.text', 'Name cannot be empty or whitespace.');

  cy.get('[data-testid="return-to-profile-button"]').click();
  cy.url().should('include', '/profile');

  cy.get('[data-testid="profile-name"]').should('have.text', 'Name: Test Testsen');

});

it('displays the changed profile email', () => {

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

  cy.get('[data-testid="navbar-logout-button"]').click();

  cy.visit('/login');
  cy.get('[data-testid="login-email-input"]').type('test@tost.com');
  cy.get('[data-testid="login-password-input"]').type('YourStrongPassword123');

  cy.get('[data-testid="login-submit-button"]').click();

  cy.url().should('eq', 'http://localhost:3000/');

  cy.visit('/profile');

  cy.url().should('include', '/profile');

  cy.get('[data-testid="profile-email"]').should('have.text', 'Email: test@tost.com');

  cy.get('[data-testid="edit-profile-button"]').click();

  cy.url().should('include', '/edit-user');

  cy.get('[data-testid="edit-profile-email-input"]').should('have.value', 'test@tost.com');

  cy.get('[data-testid="edit-profile-email-input"]').clear().type('test@test.com');

  cy.get('[data-testid="save-profile-changes-button"]').click();

  cy.get('[data-testid="edit-profile-success"]').should('have.text', 'User details updated successfully!');

  cy.get('[data-testid="return-to-profile-button"]').click();

  cy.url().should('include', '/profile');

  cy.get('[data-testid="profile-email"]').should('have.text', 'Email: test@test.com');


});

it('displays error message if email is invalid', () => {
  
  cy.visit('/profile');
  cy.url().should('include', '/profile');

  cy.get('[data-testid="edit-profile-button"]').click();
  cy.url().should('include', '/edit-user');

  // cy.get('[data-testid="edit-profile-email-input"]').should('have.value', 'test@test.com');
  cy.get('[data-testid="edit-profile-email-input"]').clear().type('test_email@example.com');

  cy.get('[data-testid="save-profile-changes-button"]').click();

  cy.get('[data-testid="edit-profile-error"]').should('have.text', 'An unexpected error occurred');

});

it('should allow password change', () => {  
  cy.visit('/profile');
  cy.url().should('include', '/profile');

  cy.get('[data-testid="change-password-button"]').click();
  cy.url().should('include', '/edit-password');

  cy.get('[data-testid="old-password-input"]').type('YourStrongPassword123');
  cy.get('[data-testid="new-password-input"]').type('YourStrongPassword1234');
  cy.get('[data-testid="save-changes-button"]').click();

  cy.get('[data-testid="change-password-success"]').should('have.text', 'Your password has been updated successfully.');

  cy.get('[data-testid="return-to-profile-button"]').click();
  cy.url().should('include', '/profile');

  cy.get('[data-testid="navbar-logout-button"]').click();

  cy.visit('/login');
  cy.get('[data-testid="login-email-input"]').type('test@test.com');
  cy.get('[data-testid="login-password-input"]').type('YourStrongPassword1234');

  cy.get('[data-testid="login-submit-button"]').click();

  cy.url().should('eq', 'http://localhost:3000/');

  cy.visit('/profile');
  cy.url().should('include', '/profile');

  cy.get('[data-testid="change-password-button"]').click();
  cy.url().should('include', '/edit-password');

  cy.get('[data-testid="old-password-input"]').type('YourStrongPassword1234');
  cy.get('[data-testid="new-password-input"]').type('YourStrongPassword123');

  cy.get('[data-testid="save-changes-button"]').click();

  cy.get('[data-testid="change-password-success"]').should('have.text', 'Your password has been updated successfully.');

  cy.get('[data-testid="return-to-profile-button"]').click();

  cy.url().should('include', '/profile');

  cy.get('[data-testid="navbar-logout-button"]').click();

  cy.visit('/login');

  cy.get('[data-testid="login-email-input"]').type('test@test.com');
  cy.get('[data-testid="login-password-input"]').type('YourStrongPassword123');

  cy.get('[data-testid="login-submit-button"]').click();

  cy.url().should('eq', 'http://localhost:3000/');

});

it('should display error message if new password is same as old', () => {

  cy.visit('/profile');
  cy.url().should('include', '/profile');

  cy.get('[data-testid="change-password-button"]').click();
  cy.url().should('include', '/edit-password');

  cy.get('[data-testid="old-password-input"]').type('YourStrongPassword123');
  cy.get('[data-testid="new-password-input"]').type('YourStrongPassword123');
  cy.get('[data-testid="save-changes-button"]').click();

  cy.get('[data-testid="change-password-error"]').should('have.text', 'New password must be different from old password');

});

it('should display error message if new password is incorrect', () => {
  
  cy.visit('/profile');
  cy.url().should('include', '/profile');

  cy.get('[data-testid="change-password-button"]').click();
  cy.url().should('include', '/edit-password');

  cy.get('[data-testid="old-password-input"]').type('YourStrongPassword1234');
  cy.get('[data-testid="new-password-input"]').type('YourStrongPassword123');
  cy.get('[data-testid="save-changes-button"]').click();

  cy.get('[data-testid="change-password-error"]').should('have.text', 'Old password is incorrect.');

  cy.get('[data-testid="old-password-input"]').clear().type('YourStrongPassword123');
  cy.get('[data-testid="new-password-input"]').clear().type('p');

  cy.get('[data-testid="save-changes-button"]').click();

  cy.get('[data-testid="change-password-error"]').should('have.text', 'Password must be at least 8 characters long.');

  cy.get('[data-testid="new-password-input"]').clear().type('yourstrongpassword');

  cy.get('[data-testid="save-changes-button"]').click();

  cy.get('[data-testid="change-password-error"]').should('have.text', 'Password must contain at least one uppercase letter.');

  cy.get('[data-testid="new-password-input"]').clear().type('Yourstrongpassword');

  cy.get('[data-testid="save-changes-button"]').click();

  cy.get('[data-testid="change-password-error"]').should('have.text', 'Password must contain at least one digit.');
});
});
