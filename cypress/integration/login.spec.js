describe('Summary Page', () => {
  it('connects to ipa', () => {
    cy.visit('https://ipa.ucdavis.edu');

    cy.on('uncaught:exception', (err, runnable) => {
      expect(err.message).to.include('hide_sidebar_menu is not defined');

      // using mocha's async done callback to finish
      // this test so we prove that an uncaught exception
      // was thrown
      done();

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
      expect(loc.origin).to.eq('https://cas.ucdavis.edu');
    });
  });

  it('accepts user login', () => {
    cy.get('#username').type(Cypress.env('username'));
    cy.get('#password').type(Cypress.env('password'));
    cy.get('#submit').click();
  });

  it('redirects to summary after login', () => {
    cy.get('h3').contains('Summary');
    cy.contains(new Date().getFullYear());
  });
});
