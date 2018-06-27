import React, { Component } from 'react';
import NavLayout from '../containers/NavLayout';
import Section from '../containers/Section';

import Carousel from '../../src/index';

import abstractImage from '../assets/images/abstract.jpg';
import animalsImage from '../assets/images/animals.jpg';
import businessImage from '../assets/images/business.jpg';
import cityImage from '../assets/images/city.jpg';
import fashionImage from '../assets/images/fashion.jpg';
import foodImage from '../assets/images/food.jpg';
import natureImage from '../assets/images/nature.jpg';
import nightlifeImage from '../assets/images/nightlife.jpg';
import peopleImage from '../assets/images/people.jpg';
import sportsImage from '../assets/images/sports.jpg';
import technicsImage from '../assets/images/technics.jpg';
import transportImage from '../assets/images/transport.jpg';


const code = `import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';

...

render() {
  return (
    <Carousel
      slidesPerPage={4}
    >
      <img className="img-example" src={someImage} />
      ...
      <img className="img-example" src={anotherImage} />
    </Carousel>
  );
}
`;

export default class PerPagePage extends Component {
  render() {
    return (
      <NavLayout>
        <Section title="Slides per page" description="slidesPerPage prop sets the number of slides that are visible per page" code={code}>
          <Carousel
            slidesPerPage={4}
          >
            <img className="img-example" src={abstractImage} />
            <img className="img-example" src={animalsImage} />
            <img className="img-example" src={businessImage} />
            <img className="img-example" src={cityImage} />
            <img className="img-example" src={fashionImage} />
            <img className="img-example" src={foodImage} />
            <img className="img-example" src={natureImage} />
            <img className="img-example" src={nightlifeImage} />
            <img className="img-example" src={peopleImage} />
            <img className="img-example" src={sportsImage} />
            <img className="img-example" src={technicsImage} />
            <img className="img-example" src={transportImage} />
          </Carousel>
        </Section>
      </NavLayout>
    );
  }
}
