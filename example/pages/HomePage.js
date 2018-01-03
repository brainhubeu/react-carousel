import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PageHeader, Grid, Row, Col } from 'react-bootstrap';
import Icon from 'react-fa';
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
      <div>
        <Grid>
          <PageHeader>
            Carousel
          </PageHeader>
          <Row>
            <button onClick={() => this.setState({ value: this.state.value - 1 })}>-</button>
            <input type="number" value={this.state.value} onChange={e => this.setState({ value: parseInt(e.target.value) })}/>
            <button onClick={() => this.setState({ value: this.state.value + 1 })}>+</button>
          </Row>
          <Row className="show-grid">
            <Col xs={12}>
              <Carousel
                value={this.state.value}
                onChange={value => this.setState({ value })}
                slidesPerPage={5}
                slidesPerScroll={2}
                arrowLeft={<Icon style={{ cursor: 'pointer' }} name="arrow-left" />}
                arrowRight={<Icon style={{ cursor: 'pointer' }} name="arrow-right" />}
                clickToChange
              >
                <img style={imgStyle} src="https://images3.memedroid.com/images/UPLOADED139/58ce2eb545235.jpeg"/>
                <img style={imgStyle} src="http://mymemes.biz/wp-content/uploads/2017/10/yoda-meme-59dc8f21e91ef.jpg"/>
                <img style={imgStyle} src="http://cdn.smosh.com/sites/default/files/bloguploads/star-wars-meme-vader-call-me.jpg"/>
                <img style={imgStyle} src="http://www.thoughtrot.com/wp-content/uploads/2014/03/yoda.jpg"/>
                <img style={imgStyle} src="http://worldwideinterweb.com/wp-content/uploads/2016/12/best-star-wars-meme.jpg"/>
                <img style={imgStyle} src="https://fthmb.tqn.com/G2cRACe8n7JUWPoeCVJP46MiF6w=/768x0/filters:no_upscale()/chewbacca-memes-58b8c8bf5f9b58af5c8c6dc9.jpg"/>
                <img style={imgStyle} src="https://memegenerator.net/img/instances/18256990/much-butthurt-in-you-i-sense.jpg"/>
                {this.renderSlide(1)}
                {this.renderSlide(2)}
                {this.renderSlide(3)}
                {this.renderSlide(4)}
                {this.renderSlide(5)}
                {this.renderSlide(6)}
              </Carousel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default connect(
  state => ({}),
  {}
)(HomePage);
