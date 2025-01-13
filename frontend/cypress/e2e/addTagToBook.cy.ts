describe('Add tag to book', () => {
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

    it('should add a tag to a book successfully', () => {
        cy.visit('/profile');
        cy.url().should('include', '/profile');
        cy.get('[data-testid="book-3"]').should('exist');
        cy.contains('My Evil Mother: A Short Story3');
    
        cy.get('[data-testid="tag-selector-3"]')
          .should('be.visible')   
          .find('option')
          .should('have.length.greaterThan', 0);  
    
        
        cy.get('[data-testid="tag-selector-3"]')
          .find('option')
          .contains("Anime")
          .should('exist');
        
        
        cy.get('[data-testid="tag-selector-3"]')
          .select('Anime');
    
        
        cy.get('[data-testid="add-tag-3"]').click();
    
       
        cy.get('[data-testid="show-tags-3"]').click();
        cy.contains('Anime');
    });
    

});