import React, { Component } from 'react';
import Icon from 'react-fa';
import NavLayout from '../containers/NavLayout';
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


export default class HomePage extends Component {
  static propTypes = {};

  render() {
    return (
      <NavLayout>
        <Carousel
          slidesPerPage={4}
          slidesPerScroll={2}
          arrowLeft={<Icon className="icon-example" name="arrow-left" />}
          arrowRight={<Icon className="icon-example" name="arrow-right" />}
          clickToChange
          centered
          breakpoints={{
            1000: { slidesPerPage: 2, clickToChange: null, centered: null },
            700: { slidesPerPage: 1, slidesPerScroll: 1, arrowLeft: null, arrowRight: null, animationSpeed: 2000 },
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
      </NavLayout>
    );
  }
}

HomePage;
