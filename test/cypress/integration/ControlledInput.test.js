describe('Controlled input', () => {
  beforeEach(() => {
    cy.visit('/docs/examples/controlled/');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');
  });

  it('goes to the slide index provided in input', () => {
    cy.get('input').type('2');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'starry-night');
  });

  it('stays at the last slide if the value in input is greater than number of slides', () => {
    cy.get('input').type('50');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'starry-night');
  });

  it('stays at the first slide if the value in input is less than 0', () => {
    for (let i = 0; i < 5; i++) {
      cy.get('input:first').type('{downArrow}');
    }

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');
  });
});
