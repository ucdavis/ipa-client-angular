describe('Summary Page', () => {
  it('connects to ipa', () => {
    cy.visit('');

    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include('hide_sidebar_menu is not defined');

      // return false to prevent the error from
      // failing this test
      return false;
    });
  });

  it('has a login button', () => {
    cy.contains('Log in').click();
  });

  it('redirects to CAS login', () => {
    cy.location().should(loc => {
      expect(loc.origin).to.eq(Cypress.env('CAS_URL'));
    });
  });

  it('accepts user login', () => {
    cy.get('#username').type(Cypress.env('username'));
    cy.get('#password').type(Cypress.env('password'));
    cy.get('#submit').click();

    cy.get('[name=proceed]').click(); // currently needed for dssapps on ssodev
  });

  it('redirects to summary after login', () => {
    cy.contains('Summary');
    cy.contains(new Date().getFullYear());
  });

    after(() => {
      cy.contains('Logout').click();
    });
});
