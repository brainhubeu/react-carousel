describe('Thumbnails', () => {
  beforeEach(() => {
    cy.visit('/docs/examples/thumbnails');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');
  });

  it('changes slide on thumbnail click', () => {
    cy.get('.BrainhubCarousel__thumbnail').eq(2).click();

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'starry-night');
  });
});
