// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add('saveLocalStorage', () => {
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add('restoreLocalStorage', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

Cypress.Commands.add('loginWithUI', () => {
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

  cy.contains('Log in').click();
  cy.get('#username').type(Cypress.env('username'));
  cy.get('#password').type(Cypress.env('password'));
  cy.get('#submit').click();
});

Cypress.Commands.add('loginAndVisit', optionalPath => {
  const username = Cypress.env('username');
  const password = Cypress.env('password');

  cy.visit('https://cas.ucdavis.edu/cas/login')

  // grab execution value from cas login page
  cy.get("input[name='execution']").then($input => {
    const executionValue = $input.val()

    cy.request({
      method: 'POST',
      url: 'https://cas.ucdavis.edu/cas/login',
      form: true,
      body: {
        username,
        password,
        _eventId: 'submit',
        submit: 'LOGIN',
        execution: executionValue,
      }
    });
  });
  // .then(res => {
  //   console.log(res);
  // });

  if (optionalPath) {
    cy.visit(optionalPath);
  } else {
    cy.visit('/summary');
  }
});
