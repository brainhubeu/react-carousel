describe('Infinite', () => {
  beforeEach(() => {
    cy.visit('/docs/examples/infinite');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');
  });

  it('repeats slides', () => {
    cy.get('.BrainhubCarousel__arrowRight')
      .trigger('click');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'scream');

    cy.get('.BrainhubCarousel__arrowRight')
      .trigger('click');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'starry-night');

    cy.get('.BrainhubCarousel__arrowRight')
      .trigger('click');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');

    cy.get('.BrainhubCarousel__arrowRight')
      .trigger('click');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'scream');

    cy.get('.BrainhubCarousel__arrowRight')
      .trigger('click');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'starry-night');

    cy.get('.BrainhubCarousel__arrowRight')
      .trigger('click');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');
  });
});
