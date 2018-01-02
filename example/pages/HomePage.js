import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PageHeader, Grid, Row, Col } from 'react-bootstrap';
import Carousel from '../../src/index';

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
            <Col xs={12}>
              <Carousel>
                <div>
                  one element
                </div>
                <div>
                  second element
                </div>
                <div>
                  third element
                </div>
              </Carousel>,
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
