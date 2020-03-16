describe('Controlled input', () => {
  beforeEach(() => {
    cy.visit('/docs/examples/controlled/');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');
  })
  it('Goes to the slide index provided in input', () => {
    cy.get('input').type('2');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'starry-night');
  });

  it('Stays at the last slide if the value in input is bigger than number of slides', () => {
    cy.get('input').type('50');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'starry-night');
  });

  it('Stays at the first slide if the value in input is less than 0', () => {
    for (let i = 0; i < 5; i++) {
      cy.get('input:first').type('{downArrow}');
    }

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');
  });
});
