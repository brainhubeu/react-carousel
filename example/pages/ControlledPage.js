import React, { Component } from 'react';
import NavLayout from '../containers/NavLayout';
import Section from '../containers/Section';

import Carousel from '../../src/index';

const code = `import Carousel from '@brainhubeu/react-carousel';

...

constructor(props) {
  super(props);
  this.state = {
    value: 0,
  };
}

onChange = e => this.setState({ value: e.target.value });

render() {
  return (
    <div>
      <input value={this.state.value} onChange={this.onChange} type="number" />
      <Carousel
        value={this.state.value}
        onChange={this.onChange}
      >
      <img className="img-example" src="http://lorempixel.com/400/400/abstract"/>
      ...
      <img className="img-example" src="http://lorempixel.com/400/400/technics"/>
      </Carousel>
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

  onChange = e => this.setState({ value: e.target.value });

  render() {
    return (
      <NavLayout>
        <Section title="Controlled component" description="You can use carousel as controlled component by providing it with value and onChange props" code={code}>
          <div>
            <input value={this.state.value} onChange={this.onChange} type="number" />
          </div>
          <Carousel
            value={this.state.value}
            onChange={this.onChange}
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
