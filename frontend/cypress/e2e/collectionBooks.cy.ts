/// <reference types="cypress" />


describe('Login Page', () => {
    beforeEach(() => {

        cy.clearLocalStorage();
        cy.clearCookies();
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

        cy.visit('/profile');
    });


    it('should display all collections and books with the correct elements', () => {
        cy.get('[id="your-collections-header"]').should('be.visible');

        cy.get('[data-testid^="collection-3"]').each(($collection) => {
            cy.wrap($collection).within(() => {
                cy.get('strong[data-testid^="collection-name-3"]').should('be.visible');

                cy.get('[data-testid^="book-"]').each(($book) => {
                    cy.wrap($book).invoke('text').then((text) => {
                            expect(text.trim().length).to.be.gt(0);
                        });

                    cy.wrap($book).find('[data-testid^="remove-book"]').should('be.visible');

                    cy.wrap($book).find('[data-testid^="show-tags"]').should('be.visible');

                    cy.wrap($book).find('[data-testid^="add-tag"]').should('be.visible');
                });
            });
        });
    });
});