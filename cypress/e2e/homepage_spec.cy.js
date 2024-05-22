describe('TVOLearn Website Functionality', () => {

  const baseUrl = 'https://tvolearn.com';

  beforeEach(() => {

    cy.viewport(1280, 720); // Set viewport to desktop size

    cy.logActivity(`Visiting Home Page: ${baseUrl}`);

    // Make a request to the page URL
    cy.request({
      url: baseUrl,
      failOnStatusCode: false // Prevent Cypress from failing the test on 404
    }).then((response) => {
      // Check the status code
      if (response.status === 404) {
        cy.logActivity('Error: Page returned a 404 status');
        // Optionally, you can fail the test if 404 is found
        throw new Error('Page returned a 404 status');
      } else {
        // Visit the page if the status is not 404
        cy.visit(baseUrl).then(() => {
          // Capture and log the page title
          cy.title().then((title) => {
            cy.logActivity(`Page Title: ${title}`);
            // cy.logToFile('Page Title:', title);
          });
        });
      }
    });

    // Ignore uncaught exceptions from the application
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    // Set default command timeout
    Cypress.config('defaultCommandTimeout', 10000);
    Cypress.config('pageLoadTimeout', 60000); // Increase page load timeout to 60 seconds
  });

  //Function for Learning Resources (K-12) Menu Opening
  const openLearningResourcesMenu = () => {
    // cy.screenshot('before-opening-menu'); // Capture screenshot before opening menu
    cy.get('button[aria-controls="SiteNavLabel-learning-resources-k-12"]', { timeout: 10000 }).then($button => {
      if ($button.is(':visible')) {
        // If the button is visible, it's a mobile view
        cy.get('button.site-nav__link--button', { timeout: 10000 }).click({ multiple: true });
      }
    });
    cy.get('button[aria-controls="SiteNavLabel-learning-resources-k-12"]', { timeout: 10000 }).click({ multiple: true });
    cy.get('div#SiteNavLabel-learning-resources-k-12', { timeout: 10000 }).should('be.visible'); // Wait for dropdown to be visible
    // cy.screenshot('after-opening-menu'); // Capture screenshot after opening menu
  };

  it('Chooses a Grade Level From Learning Resources (K-12) Menu', () => {
    openLearningResourcesMenu();

    cy.logActivity('Visitng Grade 1 page.');

    cy.contains('a', 'Grade 1', { timeout: 10000 }).should('be.visible').click({ multiple: true });

    const PageUrl = '/pages/grade-1'
    const fullUrl = `${baseUrl}${PageUrl}`;

    cy.url().should('include', PageUrl);

    // Make a request to check the status of the URL directly
    cy.request({
      url: fullUrl,
      failOnStatusCode: false // Prevent Cypress from failing the test on 404
    }).then((response) => {
      if (response.status === 404) {
        cy.logActivity('Error: Page returned a 404 status');
        // Optionally, you can fail the test if 404 is found
        throw new Error('Page returned a 404 status');
      } else {
        // Visit the page if the status is not 404
        cy.visit(fullUrl).then(() => {
          // Capture and log the page title
          cy.title().then((title) => {
            cy.logActivity(`Page Title: ${title}`);
          });
        });
      }
    });

    cy.wait(5000); // Wait for the page to load completely
    // cy.screenshot('after-navigation'); // Capture screenshot after navigation
    cy.contains('Focus on Grade 1', { timeout: 10000 }).should('be.visible');
  });

  it('Scrolls to Learn Forward in the Curriculum Section', () => {
    openLearningResourcesMenu();
    cy.contains('a', 'Grade 1', { timeout: 10000 }).should('be.visible').click({ multiple: true });
    cy.url().should('include', '/pages/grade-1');
    cy.wait(5000); // Wait for the page to load completely
    cy.get('.shg-box-content .shogun-heading-component h2').contains('Learn Forward in the Curriculum').scrollIntoView({ duration: 2000 }).should('be.visible');
    // cy.screenshot('scroll-to-curriculum'); // Capture screenshot after scrolling
  });

  it('Clicks on Mathematics Card in Learn Forward Section', () => {
    openLearningResourcesMenu();
    cy.contains('a', 'Grade 1', { timeout: 10000 }).should('be.visible').click({ multiple: true });
    cy.url().should('include', '/pages/grade-1');
    cy.wait(5000); // Wait for the page to load completely
    cy.get('.shg-box-content .shogun-heading-component h2').contains('Learn Forward in the Curriculum').scrollIntoView({ duration: 2000 }).should('be.visible');
    cy.get('.button-math', { timeout: 10000 }).should('be.visible').click({ multiple: true });
    cy.url().should('include', '/pages/grade-1-mathematics');
    // cy.screenshot('after-clicking-math'); // Capture screenshot after clicking mathematics card
  });
});


Cypress.Commands.add('logActivity', (message) => {
  cy.task('log', message);
});