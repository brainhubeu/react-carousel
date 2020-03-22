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
      .children('img')
      .click('left');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'scream');
  });

  it.only('allows to change slide when clicks on the previous slide', () => {
    cy.get('.BrainhubCarouselItem')
      .eq(1)
      .children('img')
      .click('left');

    cy.get('.BrainhubCarouselItem')
      .eq(0)
      .children('img')
      .click({ force: true } );

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');
  });
});
