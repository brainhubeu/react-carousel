describe('Dots', () => {
  beforeEach(() => {
    cy.visit('/docs/examples/dots');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');
  });

  it('changes slide on dot click', () => {
    cy.get('.BrainhubCarousel__dot').eq(2).click();

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'starry-night');
  });
});
