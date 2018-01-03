import React, { Component } from 'react';
import '../styles/CarouselItem.scss';

export default class CarouselItem extends Component {
  static propTypes = {};
  render() {
    return (
      <div className="carousel-item-container__type-a">
        <div>
          some content
        </div>
      </div>
    );
  }
}

