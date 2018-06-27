describe('workgroup page', () => {
  const INSTRUCTOR_NAME = 'Wong, Jarold';

  before(() => {
    cy.loginAndVisit();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  after(() => {
    // reset to generic instructor
    cy.contains(INSTRUCTOR_NAME)
      .parents('tr')
      .within($tr => {
        cy.get('div.instructor-type-selector').click();

        cy.get('div.dropdown-container')
          .within($dropdown => {
            cy.get('.item').contains('Instructor');
          })
          .click();
      });
  });

  it('loads the workgroup page using the cog icon', () => {
    cy.get('.ipa-header__cog-btn').click();
  });

  it('shows instructor listing for "Wong, Jarold"', () => {
    cy.get('.ipa-tabs__header').within($header => {
      cy.contains('Instructor').click();
    });

    cy.contains(INSTRUCTOR_NAME);
  });

  it('changes instructor type to Pre-Six using dropdown', () => {
    cy.contains(INSTRUCTOR_NAME)
      .parents('tr')
      .within($tr => {
        cy.get('div.instructor-type-selector').click();

        cy.get('div.dropdown-container')
          .within($dropdown => {
            cy.get('.item').contains('Pre-Six');
          })
          .click();
      });
  });

  it('shows instructor type as Pre-Six after reload', () => {
    cy.reload();

    cy.get('.ipa-tabs__tab')
      .contains('Staff')
      .click();

    cy.get('.ipa-tabs__tab')
      .contains('Instructor')
      .click();

    cy.contains(INSTRUCTOR_NAME)
      .parents('tr')
      .within($tr => {
        cy.contains('Pre-Six');
      });
  });
});
