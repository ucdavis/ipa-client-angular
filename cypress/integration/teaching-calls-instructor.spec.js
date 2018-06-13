describe('instructor can respond to a teaching call', () => {
  before(() => {
    loginAndVisit('summary/20/2019?mode=instructor');

    const createTC = () => {
      cy.visit('teachingCalls/20/2019/teachingCallStatus');
      cy.get('.teaching-call-status__submission-container > .btn').click();
      cy.contains('Wong, Jarold').click();
      cy.get('.add-instructors-modal__footer')
        .find('.btn')
        .click();
    }

    cy.get('.teaching-calls').then($TC => {
      // check if TC already submitted
      if ($TC.find('.glyphicon-ok').length) {
        // delete Submitted teaching call
        cy.log('inside submit case')
        cy.visit('teachingCalls/20/2019/teachingCallStatus');
        cy.get('.remove-instructor-ui')
          .trigger('mouseover', { force: true })
          .click({ force: true });
        cy.get('.confirmbutton-yes').click();
        // create new teaching call
        createTC();
      } else if (!$TC.find('.teaching-calls-table__button').length) {
        // if no "View Teaching Call Form Button"
        createTC();
      }
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

  // TODO: Combine Add and Remove into one test?
  it('should be able to add a preference', () => {
    cy.visit('teachingCalls/20/2019/teachingCall');
    cy.get('.search-course-container').click();
    cy.contains('ECS 010 Intro to Programming').click();

    cy.get('.preference-cell.outline > div').should(
      'contain',
      'ECS 010 Intro to Programming'
    );
  });

  it('should be able to remove a preference', () => {
    cy.visit('teachingCalls/20/2019/teachingCall');

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

    // TODO: use routes instead of UI to build up state

    // Add three courses
    // grab course ID
    // cy.server();
    // cy.route('POST', '**/assignmentView/preferences/*').as('putCourses');
    cy.get('.search-course-container').click();
    cy.contains('ECS 010 Intro to Programming').click();
    // cy.wait('@putCourses').then($xhr => {
    //   cy.log($xhr.request.body);
    // })

    cy.get('.preference-cell.outline > div').should(
      'contain',
      'ECS 010 Intro to Programming'
    );

    cy.get('.search-course-container').click();
    cy.contains('ECS 020 Discrete Math for CS').click();
    cy.get('.preference-cell.outline > div').should(
      'contain',
      'ECS 020 Discrete Math for CS'
    );

    cy.get('.search-course-container').click();
    cy.contains('ECS 030 Programming&Prob Solving').click();
    cy.get('.preference-cell.outline > div').should(
      'contain',
      'ECS 030 Programming&Prob Solving'
    );

    // Find ECS30 and click up twice
    cy.contains('ECS 030')
      .closest('.preference-row')
      .within($row => {
        cy.get('.glyphicon-chevron-up').as('upArrow');
      });

    cy.server();
    cy.route('PUT', '**/teachingAssignments').as('putReorder');
    cy.get('@upArrow').click();
    cy.wait('@putReorder');

    cy.server();
    cy.route('PUT', '**/teachingAssignments').as('putReorder');
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
    // each course pref has it's own id
    cy.server();
    cy.route('DELETE', '**/preferences/**').as('deletePref');
    cy.get('.remove-preference-btn')
      .first()
      .click();
    cy.get('.confirmbutton-yes').click({ force: true });
    cy.wait('@deletePref');
    cy.log('@deletePref')

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

  it.only('should be able to leave different preferences on different terms', () => {
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

    // Wait for update to finish and then tear down
    cy.server();
    cy.route('PUT', '**/teachingCallResponses/*').as('autoUpdate');
    cy.wait('@autoUpdate');
    cy.wait('@autoUpdate');

    // FIXME: Don't hardcode id...
    // cy.get('.toast-success').then(() => {

    // });

    cy.get('.remove-preference-btn')
      .first()
      .click();
    cy.get('.confirmbutton-yes').click({ force: true });

    cy.get('.teaching-call--academic-term-sidebar')
      .contains('Winter Quarter')
      .click();

    cy.get('.remove-preference-btn')
      .first()
      .click();
    cy.get('.confirmbutton-yes').click({ force: true });

    // Winter
    cy.request({
      method: 'PUT',
      url:
        'https://api.ipa.ucdavis.edu/api/assignmentView/teachingCallResponses/5729',
      auth: {
        bearer: localStorage.getItem('JWT')
      },
      body: {
        id: 5729,
        availabilityBlob:
          '1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1',
        termCode: '202001',
        instructorId: 2515,
        scheduleId: 232
      }
    });

    // Spring
    // FIXME: Doesn't clear Spring
    cy.request({
      method: 'PUT',
      url:
        'https://api.ipa.ucdavis.edu/api/assignmentView/teachingCallResponses/5731',
      auth: {
        bearer: localStorage.getItem('JWT')
      },
      body: {
        id: 5731,
        availabilityBlob:
          '1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1',
        termCode: '202003',
        instructorId: 2515,
        scheduleId: 232
      }
    });
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
  });

  it('should be able to see on the instructor summary screen that they have responded to a teaching call', () => {
    cy.visit('summary/20/2019?mode=instructor');
    // cy.contains('Teaching preferences have been submitted');
    cy.get('.glyphicon-ok');
  });
});
