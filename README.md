# react-carousel

> Feature-rich, react-way carousel component that does not suck 

[![CircleCI](https://circleci.com/gh/brainhubeu/react-carousel.svg?style=svg)](https://circleci.com/gh/brainhubeu/react-carousel)
[![npm](https://img.shields.io/npm/v/@brainhubeu/react-carousel.svg)](https://www.npmjs.com/package/@brainhubeu/react-carousel)
[![npm](https://img.shields.io/npm/l/@brainhubeu/react-carousel.svg)](https://www.npmjs.com/package/@brainhubeu/react-carousel)

React carousel 

## Why?
There are some great carousels (like slick) that does not have real react implementations. This library provides you with carousel that is not merely wrapper for some jQuery solution, can be used as controlled or uncontrolled element (similar to [inputs](https://reactjs.org/docs/uncontrolled-components.html)), and has tons of useful features.

## Installation
`npm i @brainhubeu/react-carousel`

## Usage
By default the component does not need anything except children to render simple carousel.
```javascript
import Carousel from '@brainhubeu/react-carousel';

...

render() {
  return (
    <Carousel>
      <img src={imageOne} />
      <img src={imageTwo} />
      <img src={imageThree} />
    </Carousel>
  );
}
```

### Carousel as controlled element
You can control which slides is being shown by providing Carousel with value and onChange props
```javascript
import Carousel from '@brainhubeu/react-carousel';

...

constructor(props) {
  super(props);
  this.state = {
    value: 0,
  };
}

// we check if we got event from input (and it has target property) or just value from Carousel 
onChange = e => this.setState({ value: e.target ? e.target.value : e });
render() {
  return (
    <div>
      <input value={this.state.value} onChange={this.onChange} type="number" />
      <Carousel
        value={this.state.value}
        onChange={this.onChange}
      >
        <img src={imageOne} />
        <img src={imageTwo} />
        <img src={imageThree} />
      </Carousel>
    </div>
  );
}
```

Where:
* `value` is current slide index (zero based, in the example above imageOne has index 0, imageTwo has index 1 and so on)
* `onChange` handler triggered when carousel wants to change current slide (e.g. on arrow click or on swipe)

### Adding arrows
You can enable default arrows or provide carousel with your own arrowLeft and arrowRight components
```javascript
import Carousel from '@brainhubeu/react-carousel';

...

render() {
  return (
    <Carousel
      arrows
    >
      <img src={imageOne} />
      <img src={imageTwo} />
      <img src={imageThree} />
    </Carousel>
  );
}
```

```javascript
import Carousel from '@brainhubeu/react-carousel';
import Icon from 'react-fa';

...

render() {
  return (
    <Carousel
      arrowLeft={<Icon className="icon-example" name="arrow-left" />}
      arrowRight={<Icon className="icon-example" name="arrow-right" />}
    >
      <img src={imageOne} />
      <img src={imageTwo} />
      <img src={imageThree} />
    </Carousel>
  );
}
```

Where:
* `arrows` is boolean indicating if default arrows should be rendered
* `arrowLeft` and `arrowRight` react elements to be used instead of default arrows (when you provided custom arrows you don't have to use `arrows` prop)

### Additional options
```javascript
import Carousel from '@brainhubeu/react-carousel';
import Icon from 'react-fa';
...
render() {
  return (
    <Carousel
      slidesPerPage={5}
      slidesPerScroll={2}
      animationSpeed={1500}
      autoPlay={3000}
      clickToChange
      centered
    >
      <img src={imageOne} />
      <img src={imageTwo} />
      <img src={imageThree} />
    </Carousel>
  );
}
```

Where:
* `slidesPerPage` is a **number** of slides visible at once 
* `slidesPerScroll` is a **number** by which value will change on autoPlay and when arrow is clicked 
* `animationSpeed` (*number*) transition duration in milliseconds
* `autoPlay` *number* of milliseconds between current slide is being automatically changed
* `clickToChange` *boolean* indicating if clicking on a slide should trigger changing current value
* `centered` *boolean* indicating if current active slide should be aligned to the center or to the left of a carousel


### Responsive
All props (except value, onChange, responsive, children) can be set to different values on different screen resolution
```javascript
import Carousel from '@brainhubeu/react-carousel';
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
        1000: { // this props will be applied when screen width is less than 1000px
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
      <img src={imageOne} />
      <img src={imageTwo} />
      <img src={imageThree} />
    </Carousel>
  );
}
```

Note: In the example above you cannot leave clickToChange value out in 500 breakpoint. In that case value from 1000 breakpoint will not be applied as the options are not inherited from higher to lower resolutions, only from default to current resolution.

## Example app
You can see how the carousel is used in the simple example app:
```
npm run example
```
and go to [localhost:3000](http://localhost:3000/).

## Unit tests
```
npm test
```

## Roadmap
*Under construction...*

## License

React-permissible is copyright © 2014-2017 [Brainhub](https://brainhub.eu/) It is free software, and may be redistributed under the terms specified in the [license](LICENSE.md).

## About

React-permissible is maintained by the Brainhub development team. It is funded by Brainhub and the names and logos for Brainhub are trademarks of Brainhub Sp. z o.o.. You can check other open-source projects supported/developed by our teammates here. 

[![Brainhub](https://avatars0.githubusercontent.com/u/20307185?s=200&v=4)](https://brainhub.eu/?utm_source=github)

We love open-source JavaScript software! See our other projects or hire us to build your next web, desktop and mobile application with JavaScript.
