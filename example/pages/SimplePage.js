import React, { Component } from 'react';
import NavLayout from '../containers/NavLayout';
import Section from '../containers/Section';

import Carousel from '../../src/index';

const code = `import Carousel from '@brainhubeu/react-carousel';

...

render() {
  return (
    <Carousel>
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
  );
}
`;

export default class SimplePage extends Component {
  render() {
    return (
      <NavLayout>
        <Section title="Simple usage" description="" code={code}>
          <Carousel>
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
        </Section>
      </NavLayout>
    );
  }
}
