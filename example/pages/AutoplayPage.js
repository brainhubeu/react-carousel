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

...

render() {
  return (
    <Carousel
      autoPlay={3000}
    >
      <img className="img-example" src={someImage} />
      ...
      <img className="img-example" src={anotherImage} />
    </Carousel>
  );
}
`;

export default class AutoplayPage extends Component {

  render() {
    return (
      <NavLayout>
        <Section title="Autoplay" description="You can turn autoplay on by setting interval duration (in ms) in autoplay prop" code={code}>
          <Carousel
            autoPlay={3000}
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
