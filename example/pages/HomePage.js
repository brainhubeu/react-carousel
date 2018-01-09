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
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  onChange = e => this.setState({ value: e.target ? parseInt(e.target.value) : e });
  render() {
    return (
      <NavLayout>
        <div>
          <input value={parseInt(this.state.value)} onChange={this.onChange} type="number" />
        </div>
        <Carousel
          value={this.state.value}
          onChange={this.onChange}
          slidesPerPage={3}
          slidesPerScroll={1}
          infinite
          centered
        >
          <img className="img-example" src="http://via.placeholder.com/250/0000ff/000000?text=1" />
          <img className="img-example" src="http://via.placeholder.com/250/00ff00/000000?text=2" />
          <img className="img-example" src="http://via.placeholder.com/250/ff0000/000000?text=3" />
          {/*<img className="img-example" src={abstractImage} />*/}
          {/*<img className="img-example" src={animalsImage} />*/}
          {/*<img className="img-example" src={businessImage} />*/}
          {/*<img className="img-example" src={cityImage} />*/}
          {/*<img className="img-example" src={fashionImage} />*/}
          {/*<img className="img-example" src={foodImage} />*/}
          {/*<img className="img-example" src={natureImage} />*/}
          {/*<img className="img-example" src={nightlifeImage} />*/}
          {/*<img className="img-example" src={peopleImage} />*/}
          {/*<img className="img-example" src={sportsImage} />*/}
          {/*<img className="img-example" src={technicsImage} />*/}
          {/*<img className="img-example" src={transportImage} />*/}
        </Carousel>
      </NavLayout>
    );
  }
}

/*

arrowLeft={<Icon className="icon-example" name="arrow-left" />}
          arrowRight={<Icon className="icon-example" name="arrow-right" />}

breakpoints={{
            1000: { slidesPerPage: 2, clickToChange: null, centered: null },
            700: { slidesPerPage: 1, slidesPerScroll: 1, arrowLeft: null, arrowRight: null, animationSpeed: 2000 },
          }}

 */
