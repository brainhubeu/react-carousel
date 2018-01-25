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


const code = `import Carousel from '@brainhubeu/react-carousel';
import Icon from 'react-fa';

...

render() {
  return (
    <Carousel
      slidesPerPage={5}
      slidesPerScroll={2}
      clickToChange
      centered
      breakpoints={{
        1000: {
          slidesPerPage: 2,
          clickToChange: false,
          centered: false,
          arrows: true,
        },
        500: {
          slidesPerPage: 1,
          slidesPerScroll: 1,
          clickToChange: false,
          centered: false,
          arrowLeft: (<Icon className="icon-example" name="arrow-left" />),
          arrowRight: (<Icon className="icon-example" name="arrow-right" />),
          animationSpeed: 2000,
        },
      }}
    >
      <img className="img-example" src={someImage} />
      ...
      <img className="img-example" src={anotherImage} />
    </Carousel>
  );
}
`;

export default class ResponsivePage extends Component {
  render() {
    return (
      <NavLayout>
        <Section title="Responsive" description="You can set all props (except value, onChange, responsive, children) to different values on different screen resolutions" code={code}>
          <Carousel
            slidesPerPage={5}
            slidesPerScroll={2}
            clickToChange
            centered
            breakpoints={{
              1000: {
                slidesPerPage: 2,
                clickToChange: false,
                centered: false,
                arrows: true,
              },
              500: {
                slidesPerPage: 1,
                slidesPerScroll: 1,
                clickToChange: false,
                centered: false,
                arrowLeft: (<Icon className="icon-example" name="arrow-left" />),
                arrowRight: (<Icon className="icon-example" name="arrow-right" />),
                animationSpeed: 2000,
              },
            }}
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
