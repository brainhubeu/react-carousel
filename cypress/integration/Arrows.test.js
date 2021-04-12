describe('Arrows', () => {
  beforeEach(() => {
    cy.visit('/docs/examples/controlled/');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');
  });

  it('changes slide when clicks on the arrow', () => {
    cy.get('.BrainhubCarousel__arrowRight').trigger('click');

    cy.wait(1);

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'scream');

    cy.get('.BrainhubCarousel__arrowLeft').trigger('click');

    cy.wait(1);

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');
  });

  it(`doesn't allow to click on the arrow if there is no more slides`, () => {
    for (let i = 0; i < 2; i++) {
      cy.get('.BrainhubCarousel__arrowRight').trigger('click');
      cy.wait(1);
    }

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'starry-night');

    cy.get('.BrainhubCarousel__arrowRight').should('be.disabled');
  });
});
