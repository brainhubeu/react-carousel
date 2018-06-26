import React, { Component } from 'react';
import Icon from 'react-fa';
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


const code = `import Carousel from '@4c/react-carousel';
import Icon from 'react-fa';

...

render() {
  return (
    <Carousel
      slidesPerPage={4}
      slidesPerScroll={2}
      arrowLeft={<Icon className="icon-example" name="arrow-left" />}
      arrowRight={<Icon className="icon-example" name="arrow-right" />}
      addArrowClickHandler
      centered
    >
      <img className="img-example" src={someImage} />
      ...
      <img className="img-example" src={anotherImage} />
    </Carousel>
  );
}
`;

export default class ArrowsPage extends Component {
  render() {
    return (
      <NavLayout>
        <Section title="Adding arrows" description="You can turn default arrows on using arrows prop or set custom arrows using arrowLeft and arrowRight props" code={code}>
          <Carousel
            centered
            slidesPerPage={4}
            slidesPerScroll={2}
            arrowLeft={<div><Icon className="icon-example" name="arrow-left" /></div>}
            arrowRight={<Icon className="icon-example" name="arrow-right" />}
            addArrowClickHandler
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
