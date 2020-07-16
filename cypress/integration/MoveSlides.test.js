describe('Move slides', () => {
  beforeEach(() => {
    cy.visit('/docs/examples/simpleUsage');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');
  });

  it('moves slide to the right if the next slide exists', () => {
    cy.get('.BrainhubCarouselItem--active')
      .trigger('mousedown')
      .trigger('mousemove', { pageX: 100 })
      .wait(10)
      .trigger('mouseup', { force: true });

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'scream');
  });

  it(`stays at the same slide if the previous one doesn't exist`, () => {
    cy.get('.BrainhubCarouselItem--active')
      .trigger('mousedown')
      .trigger('mousemove', { pageX: 990 })
      .trigger('mouseup', { force: true });

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');
  });
});
