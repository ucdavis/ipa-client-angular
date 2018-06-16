describe('create teaching calls as staff', () => {
  const INSTRUCTOR_NAME = 'Wong, Jarold';

  before(() => {
    cy.loginAndVisit('teachingCalls/20/2019/teachingCallStatus');
    cy.get('.teaching-call-status__submission-container > .btn').click();
  });

  it('starts with no teaching calls', () => {
    cy.contains('There are no instructors called.');
  });

  it('adds instructors', () => {
    cy.contains(INSTRUCTOR_NAME).click();
    cy.contains(INSTRUCTOR_NAME).should('not.have.class', 'label-toggleout');
  });

  it('configures terms', () => {
    cy.contains('Winter Quarter').click();
    cy.contains('Spring Quarter').click();

    cy.contains('Winter Quarter')
      .closest('div.checkbox')
      .should('not.have.class', 'checked');
    cy.contains('Spring Quarter')
      .closest('div.checkbox')
      .should('not.have.class', 'checked');
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

  it('access teaching call as an instructor', () => {
    cy.loginAndVisit('/teachingCalls/20/2019/teachingCall');
    cy.contains('Teaching Preferences');
  });
});
