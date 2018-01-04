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
      <img className="img-example" src="http://lorempixel.com/400/400/abstract"/>
      ...
      <img className="img-example" src="http://lorempixel.com/400/400/technics"/>
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
