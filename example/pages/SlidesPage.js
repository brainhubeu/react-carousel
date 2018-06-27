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
  const slides = [
    (<img key={1} src={abstractImage} />),
    (<img key={2} src={animalsImage} />),
    (<img key={3} src={businessImage} />),
    (<img key={4} src={cityImage} />),
    (<img key={5} src={fashionImage} />),
    (<img key={6} src={foodImage} />),
    (<img key={7} src={natureImage} />),
    (<img key={8} src={nightlifeImage} />),
    (<img key={9} src={peopleImage} />),
    (<img key={10} src={sportsImage} />),
    (<img key={11} src={technicsImage} />),
    (<img key={12} src={transportImage} />),
  ];

  return (
    <Carousel slides={slides} />
  );
}
`;

export default class SimplePage extends Component {
  render() {
    const slides = [
      (<img key={1} src={abstractImage} />),
      (<img key={2} src={animalsImage} />),
      (<img key={3} src={businessImage} />),
      (<img key={4} src={cityImage} />),
      (<img key={5} src={fashionImage} />),
      (<img key={6} src={foodImage} />),
      (<img key={7} src={natureImage} />),
      (<img key={8} src={nightlifeImage} />),
      (<img key={9} src={peopleImage} />),
      (<img key={10} src={sportsImage} />),
      (<img key={11} src={technicsImage} />),
      (<img key={12} src={transportImage} />),
    ];

    return (
      <NavLayout>
        <Section title="Simple usage" description="You can use `slides` prop instead of children to pass an array of slides" code={code}>
          <Carousel slides={slides} />
        </Section>
      </NavLayout>
    );
  }
}
