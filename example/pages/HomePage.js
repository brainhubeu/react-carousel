import React, { Component } from 'react';
import Icon from 'react-fa';
import NavLayout from '../containers/NavLayout';
import Carousel from '../../src/index';


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
          <img className="img-example" src="http://lorempixel.com/400/400/abstract"/>
          <img className="img-example" src="http://lorempixel.com/400/400/city"/>
          <img className="img-example" src="http://lorempixel.com/400/400/people"/>
          <img className="img-example" src="http://lorempixel.com/400/400/transport"/>
          <img className="img-example" src="http://lorempixel.com/400/400/animals"/>
          <img className="img-example" src="http://lorempixel.com/400/400/food"/>
          <img className="img-example" src="http://lorempixel.com/400/400/nature"/>
          <img className="img-example" src="http://lorempixel.com/400/400/business"/>
          <img className="img-example" src="http://lorempixel.com/400/400/nightlife"/>
          <img className="img-example" src="http://lorempixel.com/400/400/sports"/>
          <img className="img-example" src="http://lorempixel.com/400/400/cats"/>
          <img className="img-example" src="http://lorempixel.com/400/400/fashion"/>
          <img className="img-example" src="http://lorempixel.com/400/400/technics"/>
        </Carousel>
      </NavLayout>
    );
  }
}

HomePage;
