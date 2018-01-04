import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from 'react-fa';
import NavLayout from '../containers/NavLayout';
import Carousel from '../../src/index';

const imgStyle = { maxHeight: '300px', maxWidth: '100%', padding: '0 20px' };

class HomePage extends Component {
  static propTypes = {};
  constructor(props) {
    super(props);
    this.state = { value: 0 };
  }

  renderSlide = i => (
    <div style={{ height: i % 2 ? '100px' : '200px', width: i % 2 ? '200px' : '100px', backgroundColor: i % 2 ? 'red' : 'blue' }}>
      {i}
    </div>
  );

  render() {
    return (
      <NavLayout>
        <Carousel
          value={this.state.value}
          onChange={value => this.setState({ value })}
          slidesPerPage={4}
          slidesPerScroll={2}
          arrowLeft={<Icon style={{ cursor: 'pointer' }} name="arrow-left" />}
          arrowRight={<Icon style={{ cursor: 'pointer' }} name="arrow-right" />}
          clickToChange
          centered
          breakpoints={{
            1000: { slidesPerPage: 2, clickToChange: null, centered: null },
            700: { slidesPerPage: 1, slidesPerScroll: 1, arrowLeft: null, arrowRight: null, animationSpeed: 2000 },
          }}
        >
          <img style={imgStyle} src="https://images3.memedroid.com/images/UPLOADED139/58ce2eb545235.jpeg"/>
          {this.renderSlide(1)}
          <img style={imgStyle} src="http://mymemes.biz/wp-content/uploads/2017/10/yoda-meme-59dc8f21e91ef.jpg"/>
          {this.renderSlide(2)}
          <img style={imgStyle} src="http://cdn.smosh.com/sites/default/files/bloguploads/star-wars-meme-vader-call-me.jpg"/>
          {this.renderSlide(3)}
          <img style={imgStyle} src="http://www.thoughtrot.com/wp-content/uploads/2014/03/yoda.jpg"/>
          {this.renderSlide(4)}
          <img style={imgStyle} src="http://worldwideinterweb.com/wp-content/uploads/2016/12/best-star-wars-meme.jpg"/>
          {this.renderSlide(5)}
          <img style={imgStyle} src="https://fthmb.tqn.com/G2cRACe8n7JUWPoeCVJP46MiF6w=/768x0/filters:no_upscale()/chewbacca-memes-58b8c8bf5f9b58af5c8c6dc9.jpg"/>
          {this.renderSlide(6)}
          <img style={imgStyle} src="https://memegenerator.net/img/instances/18256990/much-butthurt-in-you-i-sense.jpg"/>
        </Carousel>
      </NavLayout>
    );
  }
}

export default connect(
  state => ({}),
  {}
)(HomePage);
