import React, { Component } from 'react';
import Icon from 'react-fa';
import NavLayout from '../containers/NavLayout';
import Section from '../containers/Section';

import Carousel from '../../src/index';

const code = `import Carousel from '@brainhubeu/react-carousel';
import Icon from 'react-fa';

...

render() {
  return (
    <Carousel
      slidesPerPage={4}
      slidesPerScroll={2}
      arrowLeft={<Icon className="icon-example" name="arrow-left" />}
      arrowRight={<Icon className="icon-example" name="arrow-right" />}
      centered
    >
      <img className="img-example" src="http://lorempixel.com/400/400/abstract"/>
      ...
      <img className="img-example" src="http://lorempixel.com/400/400/technics"/>
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
            slidesPerPage={4}
            slidesPerScroll={2}
            arrowLeft={<Icon className="icon-example" name="arrow-left" />}
            arrowRight={<Icon className="icon-example" name="arrow-right" />}
            centered
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
        </Section>
      </NavLayout>
    );
  }
}
