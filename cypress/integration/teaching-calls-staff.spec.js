describe('create teaching calls as staff', () => {
  const INSTRUCTOR_NAME = 'Apps, DSS';

  before(() => {
    cy.loginAndVisit('teachingCalls/20/2019/teachingCallStatus');

    // If Teaching Call for Instructor exists, delete it before running tests
    cy.server();
    cy.route('DELETE', '**/teachingCallReceipts/*').as('removeTeachingCall');

    cy.get('.instructor-section').then($section => {
      if ($section.find('.remove-instructor-ui').length) {
        cy.get('.remove-instructor-ui')
          .trigger('mouseover', { force: true })
          .click({ force: true });
        cy.get('.confirmbutton-yes').click();
        cy.wait('@removeTeachingCall');
      }
    });
  });

  it('starts with no teaching calls', () => {
    cy.contains('There are no instructors called.');
  });

  it('adds instructors', () => {
    cy.get('.teaching-call-status__submission-container > .btn').click();
    cy.contains(INSTRUCTOR_NAME).click();
    cy.contains(INSTRUCTOR_NAME).should('not.have.class', 'label-toggleout');
  });

  it('configures terms', () => {
    cy.contains('Fall Quarter').click();
    cy.contains('Winter Quarter').click();
    cy.contains('Spring Quarter').click();

    cy.contains('Fall Quarter')
      .closest('div.checkbox')
      .should('not.have.class', 'checked');
    cy.contains('Winter Quarter')
      .closest('div.checkbox')
      .should('not.have.class', 'checked');
    cy.contains('Spring Quarter')
      .closest('div.checkbox')
      .should('not.have.class', 'checked');

    cy.contains('Fall Quarter').click();
    cy.contains('Winter Quarter').click();
    cy.contains('Spring Quarter').click();
  });

  it('toggles Send Email text input', () => {
    cy.contains('Send Email').click();
    cy.get('.teaching-call-message-input').should('not.exist');

    cy.contains('Send Email').click();
    cy.get('.teaching-call-message-input');
  });

  it('accepts email text input', () => {
    cy.get('textarea').type('{selectall}Hello, World!');
    cy.get('textarea').should('have.value', 'Hello, World!');
  });

  it('can access teaching call as an instructor', () => {
    cy.get('button')
      .contains('Send')
      .click();

    cy.loginAndVisit('summary/20/2019?mode=instructor');
    cy.contains('View Teaching Call Form');
  });
});
