// TODO find a better way
Cypress.on('uncaught:exception', (error) => {
  console.error('an uncaught eaten exception', error);
  return false;
});

describe('Click to change', () => {
  beforeEach(() => {
    cy.visit('/docs/examples/clickToChange/');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');
  });

  it('allows to change slide when clicks on the next slide', () => {
    cy.get('.BrainhubCarouselItem')
      .eq(1)
      .trigger('mousedown')
      .wait(10)
      .trigger('mouseup', { force: true });

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'scream');
  });

  it('allows to change slide when clicks on the previous slide', () => {
    cy.get('.BrainhubCarouselItem')
      .eq(1)
      .trigger('mousedown')
      .wait(10)
      .trigger('mouseup', { force: true });

    cy.get('.BrainhubCarouselItem')
      .eq(0)
      .trigger('mousedown')
      .wait(10)
      .trigger('mouseup', { force: true });

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');
  });
});
