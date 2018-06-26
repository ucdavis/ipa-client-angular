describe('instructor can respond to a teaching call', () => {
  const INSTRUCTOR_NAME = 'Apps, DSS';

  before(() => {
    cy.loginAndVisit('summary/20/2019?mode=instructor');

    const createTeachingCall = () => {
      cy.visit('teachingCalls/20/2019/teachingCallStatus');
      cy.get('.teaching-call-status__submission-container > .btn').click();
      cy.contains(INSTRUCTOR_NAME).click();
      cy.get('.add-instructors-modal__footer')
        .find('.btn')
        .click();
    };

    cy.get('.teaching-calls').then($TC => {
      // check if TC already submitted
      if ($TC.find('.glyphicon-ok').length) {
        // delete Submitted teaching call
        cy.visit('teachingCalls/20/2019/teachingCallStatus');
        cy.get('.remove-instructor-ui')
          .trigger('mouseover', { force: true })
          .click({ force: true });
        cy.get('.confirmbutton-yes').click();
        // create new teaching call
        createTeachingCall();
      } else if (!$TC.find('.teaching-calls-table__button').length) {
        // if no "View Teaching Call Form Button"
        createTeachingCall();
      }

      // Get data from teaching call form to clear existing form before tests
      cy.request({
        method: 'GET',
        url:
          'https://api.ipa.ucdavis.edu/api/teachingCallView/20/2019/teachingCallForm',
        auth: {
          bearer: localStorage.getItem('JWT')
        }
      }).then(res => {
        const data = JSON.parse(res.allRequestResponses['0']['Response Body']);
        const {
          teachingAssignments,
          teachingCallResponses,
          instructorId
        } = data;

        // find the instructor's existing course preferences
        const instructorAssignments = teachingAssignments.filter(
          course => course.instructorId === instructorId
        );

        // get response ids for Fall (201910), Winter (202001), Spring(202003)
        const instructorResponses = teachingCallResponses.filter(
          ({ termCode }) =>
            termCode === '201910' ||
            termCode === '202001' ||
            termCode === '202003'
        );

        // make requests to delete courses and clear grid responses
        instructorAssignments.forEach(course => {
          cy.request({
            method: 'DELETE',
            url: `https://api.ipa.ucdavis.edu/api/assignmentView/preferences/${
              course.id
            }`,
            auth: { bearer: localStorage.getItem('JWT') },
            body: 'test'
          });
        });

        instructorResponses.forEach(response => {
          const cleanBlob = {
            availabilityBlob:
              '1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1'
          };
          const cleanResponse = Object.assign(response, cleanBlob);

          cy.request({
            method: 'PUT',
            url: `https://api.ipa.ucdavis.edu/api/assignmentView/teachingCallResponses/${
              response.id
            }`,
            auth: { bearer: localStorage.getItem('JWT') },
            body: cleanResponse
          });
        });
      });
    });
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('shows active teaching calls', () => {
    cy.visit('summary/20/2019?mode=instructor');
    cy.contains('Teaching Call for Review');
  });

  it('loads active teaching call form', () => {
    cy.visit('summary/20/2019?mode=instructor');
    cy.get('.teaching-calls-table__button').click();
    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/teachingCalls/20/2019/teachingCall');
    });
    cy.contains('Teaching Call');
    cy.contains('Teaching Preferences');
    cy.contains('Academic Term');
  });

  it('shows all three configured quarters', () => {
    cy.visit('teachingCalls/20/2019/teachingCall');
    cy.get('.teaching-call--academic-term-sidebar li').as('list');
    cy.get('@list').should('have.length', 3);
  });

  it('should be able to add and remove a preference', () => {
    cy.visit('teachingCalls/20/2019/teachingCall');

    cy.server();
    cy.route('POST', '**/preferences/**').as('addPref');
    cy.get('.search-course-container').click();
    cy.contains('ECS 010 Intro to Programming').click();
    cy.wait('@addPref');

    cy.get('.preference-cell.outline > div').should(
      'contain',
      'ECS 010 Intro to Programming'
    );

    cy.get('.remove-preference-btn')
      .first()
      .click();
    cy.get('.confirmbutton-yes').click();
    cy.get('.preference-cell.outline > div').should(
      'not.contain',
      'ECS 010 Intro to Programming'
    );
  });

  it('should be able to re-order a preference', () => {
    cy.visit('/teachingCalls/20/2019/teachingCall');

    // Add three courses, set up route to wait
    cy.server();
    cy.route('POST', '**/preferences/**').as('addPref');

    cy.get('.search-course-container').click();
    cy.contains('ECS 010 Intro to Programming').click();
    cy.get('.preference-cell.outline > div').should(
      'contain',
      'ECS 010 Intro to Programming'
    );
    cy.wait('@addPref');

    cy.get('.search-course-container').click();
    cy.contains('ECS 020 Discrete Math for CS').click();
    cy.get('.preference-cell.outline > div').should(
      'contain',
      'ECS 020 Discrete Math for CS'
    );
    cy.wait('@addPref');

    cy.get('.search-course-container').click();
    cy.contains('ECS 030 Programming&Prob Solving').click();
    cy.get('.preference-cell.outline > div').should(
      'contain',
      'ECS 030 Programming&Prob Solving'
    );
    cy.wait('@addPref');

    // Find ECS30 and click up twice
    cy.contains('ECS 030')
      .closest('.preference-row')
      .within($row => {
        cy.get('.glyphicon-chevron-up').as('upArrow');
      });

    // Captures reorder request and waits for it to update before continuing
    cy.server();
    cy.route('PUT', '**/teachingAssignments').as('putReorder');
    cy.get('@upArrow').click();
    cy.wait('@putReorder');

    cy.get('@upArrow').click();
    cy.wait('@putReorder');

    // Final order is ECS30, ECS20, ECS10
    cy.get(':nth-child(2) > .preference-cell > div').should(
      'contain',
      'ECS 030 Programming&Prob Solving'
    );
    cy.get(':nth-child(3) > .preference-cell > div').should(
      'contain',
      'ECS 010 Intro to Programming'
    );
    cy.get(':nth-child(4) > .preference-cell > div').should(
      'contain',
      'ECS 020 Discrete Math for CS'
    );

    // remove courses after
    cy.server();
    cy.route('DELETE', '**/preferences/**').as('deletePref');
    cy.get('.remove-preference-btn')
      .first()
      .click();
    cy.get('.confirmbutton-yes').click({ force: true });
    cy.wait('@deletePref');

    cy.get('.remove-preference-btn')
      .first()
      .click();
    cy.get('.confirmbutton-yes').click({ force: true });
    cy.wait('@deletePref');

    cy.get('.remove-preference-btn')
      .first()
      .click();
    cy.get('.confirmbutton-yes').click({ force: true });
  });

  it('should be able to indicate unavailabilities', () => {
    cy.visit('/teachingCalls/20/2019/teachingCall');

    // Clicks entire row
    cy.get('.left')
      .contains('7')
      .parent('tr')
      .within($row => {
        cy.get('td').click({ multiple: true });
      });

    cy.get('.left')
      .contains('8')
      .parent('tr')
      .within($row => {
        cy.get('td').click({ multiple: true });
      });

    cy.get('.left')
      .contains('7')
      .parent('tr')
      .within($row => {
        cy.get('td')
          .filter('.unavailable')
          .should('have.length', '5');
      });

    cy.get('.left')
      .contains('8')
      .parent('tr')
      .within($row => {
        cy.get('td')
          .filter('.unavailable')
          .should('have.length', '5');
      });
  });

  it('should be able to leave a comment', () => {
    cy.get('textarea').type('{selectall}This is a comment');
    cy.get('textarea').should('have.value', 'This is a comment');
  });

  it('should be able to leave different preferences on different terms', () => {
    cy.visit('/teachingCalls/20/2019/teachingCall');

    cy.get('.teaching-call--academic-term-sidebar')
      .contains('Winter Quarter')
      .click();

    cy.get('.search-course-container').click();
    cy.contains('ECS 122A Algorithm Design').click();

    cy.get('.preference-cell.outline > div').should(
      'contain',
      'ECS 122A Algorithm Design'
    );

    // Fill up two rows on the Unavailabilities grid
    cy.get('.left')
      .contains('10')
      .parent('tr')
      .within($row => {
        cy.get('td').click({ multiple: true });
      });

    cy.get('.left')
      .contains('11')
      .parent('tr')
      .within($row => {
        cy.get('td').click({ multiple: true });
      });

    // Check that row '10' and '11' have 5 days shaded
    cy.get('.left')
      .contains('10')
      .parent('tr')
      .within($row => {
        cy.get('td')
          .filter('.unavailable')
          .should('have.length', '5');
      });

    cy.get('.left')
      .contains('11')
      .parent('tr')
      .within($row => {
        cy.get('td')
          .filter('.unavailable')
          .should('have.length', '5');
      });

    cy.get('.teaching-call--academic-term-sidebar')
      .contains('Spring Quarter')
      .click();

    cy.get('.search-course-container').click();
    cy.contains('ECS 122B Algorithm Design').click();

    cy.get('.preference-cell.outline > div').should(
      'contain',
      'ECS 122B Algorithm Design'
    );

    // Capture routes to make sure grid updates before continuing
    cy.server();
    cy.route('PUT', '**/teachingCallResponses/*').as('updateGrid');

    cy.get('.left')
      .contains('3')
      .parent('tr')
      .within($row => {
        cy.get('td').click({ multiple: true });
      });

    cy.get('.left')
      .contains('4')
      .parent('tr')
      .within($row => {
        cy.get('td').click({ multiple: true });
      });

    cy.get('.left')
      .contains('3')
      .parent('tr')
      .within($row => {
        cy.get('td')
          .filter('.unavailable')
          .should('have.length', '5');
      });

    cy.get('.left')
      .contains('4')
      .parent('tr')
      .within($row => {
        cy.get('td')
          .filter('.unavailable')
          .should('have.length', '5');
      });
    cy.wait('@updateGrid').wait('@updateGrid');
  });

  it('should be able to reload the page and see all information saved', () => {
    cy.visit('/teachingCalls/20/2019/teachingCall');

    cy.get('.search-course-container').click();
    cy.contains('ECS 010 Intro to Programming').click();

    cy.get('.teaching-call--academic-term-sidebar')
      .contains('Winter Quarter')
      .click();

    cy.get('.search-course-container').click();
    cy.contains('ECS 015 Intro to Computers').click();

    cy.get('.teaching-call--academic-term-sidebar')
      .contains('Spring Quarter')
      .click();

    cy.get('.search-course-container').click();
    cy.contains('ECS 120 Theory Computation').click();

    cy.reload();

    cy.get('.preference-cell.outline > div').should(
      'contain',
      'ECS 010 Intro to Programming'
    );

    cy.get('.teaching-call--academic-term-sidebar')
      .contains('Winter Quarter')
      .click();

    cy.get('.preference-cell.outline > div').should(
      'contain',
      'ECS 015 Intro to Computers'
    );

    cy.get('.teaching-call--academic-term-sidebar')
      .contains('Spring Quarter')
      .click();

    cy.get('.preference-cell.outline > div').should(
      'contain',
      'ECS 120 Theory Computation'
    );
  });

  it('should be able to submit preferences', () => {
    cy.contains('Submit').click();
    cy.get('.confirmbutton-yes').click();

    cy.location().should(loc => {
      expect(loc.search).to.eq('?mode=instructor&submittedTC=true');
    });
  });

  it('should be able to see on the instructor summary screen that they have responded to a teaching call', () => {
    cy.visit('summary/20/2019?mode=instructor');
    cy.get('.glyphicon-ok');
  });
});
