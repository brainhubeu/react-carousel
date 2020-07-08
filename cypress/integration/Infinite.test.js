describe('Infinite', () => {
  beforeEach(() => {
    cy.visit('/docs/examples/infinite');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');
  });

  it('repeats slides when swipes right', () => {
    for (let i = 0; i < 17; i++) {
      cy.get('.BrainhubCarousel__arrowRight').trigger('click');

      cy.wait(5);
    }

    cy.wait(20);

    cy.get('.BrainhubCarouselItem--active')
      .children('img')

      .should('have.attr', 'src')
      .and('contain', 'starry-night');
  });

  it('repeats slides when swipes left', () => {
    for (let i = 0; i < 17; i++) {
      cy.get('.BrainhubCarousel__arrowLeft').trigger('click');

      cy.wait(5);
    }

    cy.wait(20);

    cy.get('.BrainhubCarouselItem--active')
      .children('img')

      .should('have.attr', 'src')
      .and('contain', 'scream');
  });
});
