describe('instructors page', () => {
  const INSTRUCTOR_NAME = 'Jarold Wong';
  const COURSE_NUMBER = 'ECS 010';

  before(() => {
    cy.loginAndVisit();
  });

  it('navigates to the Assign Instructors page', () => {
    cy.contains('Instructors').click();
    cy.contains('Assign Instructors').click();
    cy.location().should(loc => {
      expect(loc.pathname).to.contains('assignments');
    });
    cy.contains('Assignments');
  });

  it('assigns instructor to ECS10', () => {
    cy.contains(COURSE_NUMBER)
      .parents('div.course-list-row')
      .as('row')
      .within($row => {
        cy.get('.dropdown').click();

        cy.server();
        cy.route('POST', '**/assignmentView/**').as('postInstructor');

        cy.contains(INSTRUCTOR_NAME).click();
      });

    cy.wait('@postInstructor')
      .get('@row')
      .contains(INSTRUCTOR_NAME);

    cy.get('.toast').contains('Assigned instructor to course');
  });

  it('removes assigned instructor from ECS10', () => {
    cy.contains(COURSE_NUMBER)
      .parents('div.course-list-row')
      .as('row');

    cy.get('@row')
      .contains(INSTRUCTOR_NAME)
      .find('[data-event-type=deleteAssignmentPop]')
      .click();

    cy.get('[data-event-type=deleteAssignment]').click();
  });
});
