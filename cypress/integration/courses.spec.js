describe('courses page', () => {
  const COURSE_NUMBER = 'ECS 010 - A';

  before(() => {
    cy.loginAndVisit();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('navigates to Courses page from Summary', () => {
    cy.visit('summary');
    // wait for all the backend calls to finish before continuing
    cy.server();
    cy.route('GET', '**/summaryView/**').as('getSummary');
    cy.wait('@getSummary').wait('@getSummary');

    cy.contains('Courses').click();
    cy.location().should(loc => {
      expect(loc.pathname).to.contain('courses');
    });
  });

  it('contains a courses table', () => {
    cy.get('table[course-table]');
  });

  it('removes ECS courses from 2018-19', () => {
    cy.visit('courses/20/2018');
    cy.get('[data-event-type=selectAllCourseRows].checkbox-container').click();
    cy.get('span.tool-icon.glyphicon.glyphicon-trash').click();
    cy.get('.delete-course-modal-footer').within($modal => {
      cy.server();
      cy.route('PUT', '**/courseView/**').as('deleteCourses');
      cy.get('button.btn-danger').click();
    });
    cy.wait('@deleteCourses');
  });

  it('adds ECS courses from 2015-16', () => {
    cy.get('.table-toolbar')
      .find('.glyphicon-plus')
      .click();
    cy.contains('Add Multiple Courses');

    cy.contains('Source')
      .next('.col-sm-4')
      .within($col => {
        cy.get('.selectize-control').click();
        cy.get('[data-value=Banner]').click();
      });

    cy.contains('Subject Code')
      .next('.col-sm-4')
      .within($col => {
        cy.get('.selectize-control').click();
        cy.get('[data-value=ECS]').click();
      });

    cy.contains('Academic Year')
      .next('.col-sm-4')
      .within($col => {
        cy.get('.selectize-control').click();
        cy.get('[data-value=2015]').click();
      });

    cy.server();
    cy.route('GET', '**/sections/**').as('getSections');
    cy.contains('Search Banner').click();
    cy.wait('@getSections');

    cy.server();
    cy.route('POST', '**/courseView/**').as('postCourses');

    cy.contains('Import courses').click();
    cy.wait('@postCourses', { timeout: 60000 });

    cy.contains(COURSE_NUMBER);
  });
});
