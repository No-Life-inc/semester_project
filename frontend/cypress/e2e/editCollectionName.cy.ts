// EditCollection.cy.ts

/// <reference types="cypress" />

describe('Edit Collection Feature', () => {
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

        cy.visit('/profile');
    });

    it('should allow the user to edit an existing collection name', () => {
        cy.get('[data-testid="collection-3"]').within(() => {
            cy.get('[data-testid="edit-collection-3"]').click();
        });

        cy.get('[data-testid="edit-collection-input"]')
            .clear()
            .type('My Updated Collection');

        cy.get('[data-testid="save-collection-button"]').click();

        cy.get('[data-testid="collection-3"]').within(() => {
            cy.get('[data-testid="collection-name-3"]')
                .should('be.visible')
                .and('contain.text', 'My Updated Collection');
        });
    });


    it('should show an error message if the new collection name is too short', () => {
        cy.get('[data-testid="collection-3"]').within(() => {
            cy.get('[data-testid="edit-collection-3"]').click();
        });

        cy.get('[data-testid="edit-collection-input"]').clear()
        cy.get('[data-testid="save-collection-button"]').click();

        cy.get('[data-testid="edit-collection-error"]')
            .should('be.visible')
            .and('contain.text', 'Collection name is required.');
    });
});
