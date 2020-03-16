describe('Click to change', () => {
  beforeEach(() => {
      cy.visit('/docs/examples/clickToChange/');

      cy.get('.BrainhubCarouselItem--active')
        .children('img')
        .should('have.attr', 'src')
        .and('contain', 'mona');
    });
  it('allow to change slide when clicks on the next slide', () => {
    cy.get('.BrainhubCarouselItem')
      .eq(1)
      .children('img')
      .click('left');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'scream');
  });

  it('allow to change slide when clicks on the previous slide', () => {
    cy.get('.BrainhubCarouselItem')
      .eq(1)
      .children('img')
      .click('left');

    cy.get('.BrainhubCarouselItem')
      .eq(0)
      .children('img')
      .click();

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');
  });
});
