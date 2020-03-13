describe('Homepage', () => {
  it(`should swipie slide`, () => {
    cy.visit('/docs/examples/simpleUsage/');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');

    cy.get('.BrainhubCarouselItem--active')
      .trigger('mousedown')
      .trigger('mousemove', { pageX: 300 })
      .trigger('mouseup', { force: true });

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'scream');
  });

  it(`changes slide when clicks on the arrow`, () => {
    cy.visit('/docs/examples/controlled/');

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

    cy.get('.BrainhubCarousel__arrowLeft')
      .trigger('click');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');
  });

  it(`should swipie slide`, () => {
    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');

    cy.get('input').type('2');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'starry-night');
  });

  it('changes slide on next slide click', () => {
    cy.visit('/docs/examples/clickToChange/');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');

    cy.get('.BrainhubCarouselItem')
      .eq(1)
      .children('img')
      .click('left');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'scream');
  });

  it('automatically changes slides', () => {
    cy.visit('/docs/examples/animation');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');

    cy.wait(2000);

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'scream');
  });

  it('changes slide on dot click', () => {
    cy.visit('/docs/examples/dots');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');

    cy.get('.BrainhubCarousel__dot')
      .eq(2)
      .click();

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'starry-night');
  });

  it('changes slide on thumbnail click', () => {
    cy.visit('/docs/examples/thumbnails');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');

    cy.get('.BrainhubCarousel__thumbnail')
      .eq(2)
      .click();

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'starry-night');
  });

  it('repeats slides', () => {
    cy.visit('/docs/examples/infinite');

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'mona');

    for (let i = 0; i < 17; i++) {
      cy.get('.BrainhubCarousel__arrowRight')
        .trigger('click');
    }

    cy.get('.BrainhubCarouselItem--active')
      .children('img')
      .should('have.attr', 'src')
      .and('contain', 'starry-night');
  });
});
