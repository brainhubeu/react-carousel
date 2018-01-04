import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PageHeader, Grid, Row, Col } from 'react-bootstrap';
import Carousel from '../../src/index';
import CarouselItemTypeA from './../components/CarouselItemTypeA';
import CarouselItemTypeB from './../components/CarouselItemTypeB';

class HomePage extends Component {
  static propTypes = {};
  constructor(props) {
    super(props);
    this.state = { value: 0 };
  }

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
                slidesPerPage={2}
                slidesPerScroll={2}
                autoPlay={3000}
              >
                <img style={{ maxHeight: '300px' }} src="https://images3.memedroid.com/images/UPLOADED139/58ce2eb545235.jpeg"/>
                <CarouselItemTypeB>two</CarouselItemTypeB>
                <CarouselItemTypeA>three</CarouselItemTypeA>
                <CarouselItemTypeB>four</CarouselItemTypeB>
                <CarouselItemTypeB>five</CarouselItemTypeB>
                <CarouselItemTypeA>six</CarouselItemTypeA>
                <CarouselItemTypeB>seven</CarouselItemTypeB>
                <CarouselItemTypeB>eight</CarouselItemTypeB>
                <CarouselItemTypeA>nine</CarouselItemTypeA>
                <CarouselItemTypeB>ten</CarouselItemTypeB>
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
