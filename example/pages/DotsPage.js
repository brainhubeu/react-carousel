import React, { Component } from 'react';
import NavLayout from '../containers/NavLayout';
import Section from '../containers/Section';

import Carousel, { Dots } from '../../src/index';

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


const code = `import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';

...

constructor(props) {
  super(props);
  this.state = {
    value: 0,
  };
}

onChange = value => this.setState({ value });

render() {
  return (
    <div>
      <Carousel
        value={this.state.value}
        onChange={this.onChange}
        infinite
      >
        <img className="img-example" src={someImage} />
        ...
        <img className="img-example" src={anotherImage} />
      </Carousel>
      <Dots value={this.state.value} onChange={this.onChange} number={12} />
      <Dots
        value={this.state.value}
        onChange={this.onChange}
        thumbnails={[
          (<img key={1} className="img-example-small" src={abstractImage} />),
          (<img key={2} className="img-example-small" src={animalsImage} />),
          (<img key={3} className="img-example-small" src={businessImage} />),
          (<img key={4} className="img-example-small" src={cityImage} />),
          (<img key={5} className="img-example-small" src={fashionImage} />),
          (<img key={6} className="img-example-small" src={foodImage} />),
          (<img key={7} className="img-example-small" src={natureImage} />),
          (<img key={8} className="img-example-small" src={nightlifeImage} />),
          (<img key={9} className="img-example-small" src={peopleImage} />),
          (<img key={10} className="img-example-small" src={sportsImage} />),
          (<img key={11} className="img-example-small" src={technicsImage} />),
          (<img key={12} className="img-example-small" src={transportImage} />),
        ]}
      />
    </div>
  );
}
`;

export default class ControlledPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  onChange = value => this.setState({ value });

  render() {
    return (
      <NavLayout>
        <Section title="Dots component" description="You can show navigation dots using Dots component. To show navigation thumbnails use `thumbnails` prop" code={code}>
          <Carousel
            value={this.state.value}
            onChange={this.onChange}
            infinite
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
          <Dots value={this.state.value} onChange={this.onChange} number={12} />
          <Dots
            value={this.state.value}
            onChange={this.onChange}
            thumbnails={[
              (<img key={1} className="img-example-small" src={abstractImage} />),
              (<img key={2} className="img-example-small" src={animalsImage} />),
              (<img key={3} className="img-example-small" src={businessImage} />),
              (<img key={4} className="img-example-small" src={cityImage} />),
              (<img key={5} className="img-example-small" src={fashionImage} />),
              (<img key={6} className="img-example-small" src={foodImage} />),
              (<img key={7} className="img-example-small" src={natureImage} />),
              (<img key={8} className="img-example-small" src={nightlifeImage} />),
              (<img key={9} className="img-example-small" src={peopleImage} />),
              (<img key={10} className="img-example-small" src={sportsImage} />),
              (<img key={11} className="img-example-small" src={technicsImage} />),
              (<img key={12} className="img-example-small" src={transportImage} />),
            ]}
          />
        </Section>
      </NavLayout>
    );
  }
}
