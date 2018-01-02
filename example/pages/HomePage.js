import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PageHeader, Grid, Row, Col } from 'react-bootstrap';

class HomePage extends Component {
  static propTypes = {};
  render() {
    return (
      <div>
        <Grid>
          <PageHeader>
            Carousel
          </PageHeader>
          <Row className="show-grid">
            <Col xs={12} md={6}>
              <h2>Some xample goes here</h2>
            </Col>
            <Col xs={12} md={6}>
              <h2>Another example here</h2>
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
