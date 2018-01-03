import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { connect } from 'react-redux';
import { PageHeader, Grid, Row, Col } from 'react-bootstrap';

class HomePage extends Component {
  static propTypes = {};
  constructor(props) {
    super(props);
    this.state = { offset: 0, dragOffset: 0, dragStart: null };
  }

  // mouse
  onMouseDown = e => {
    this.setState({ dragStart: e.pageX });
    console.log('onMouseDown', e.pageX);
  }

  onMouseMove = e => {
    if (this.state.dragStart !== null) {
      this.setState({ dragOffset: e.pageX - this.state.dragStart });
      console.log('onMouseMove', e.pageX);
    }
  }

  onMouseUp = e => {
    if (this.state.dragStart !== null) {
      this.setState({ offset: this.state.offset - this.state.dragStart + e.pageX, dragOffset: 0, dragStart: null });
      console.log('onMouseUp', e.pageX);
    }
  }


  // touch
  onTouchStart = e => {
    e.persist();
    this.setState({ dragStart: e.changedTouches[0].pageX });
    console.log('onTouchStart', e, e.changedTouches[0].pageX);
  }

  onTouchMove = e => {
    if (this.state.dragStart !== null) {
      this.setState({ dragOffset: e.changedTouches[0].pageX - this.state.dragStart });
      console.log('onTouchMove', e.pageX);
    }
  }

  onTouchEnd = e => {
    if (this.state.dragStart !== null) {
      this.setState({
        offset: this.state.offset - this.state.dragStart + e.changedTouches[0].pageX,
        dragOffset: 0,
        dragStart: null
      });
      console.log('onTouchEnd', e.pageX);
    }
  }

  componentDidMount = () => {
    const domNode = ReactDom.findDOMNode(this.movableRef);
    domNode.ownerDocument.addEventListener('mousemove', this.onMouseMove, true);
    domNode.ownerDocument.addEventListener('mouseup', this.onMouseUp, true);
    domNode.ownerDocument.addEventListener('touchmove', this.onTouchMove, true);
    domNode.ownerDocument.addEventListener('touchend', this.onTouchEnd, true);
  }

  componentWillUnmount = () => {
    const domNode = ReactDom.findDOMNode(this.movableRef);
    domNode.ownerDocument.removeEventListener('mousemove', this.onMouseMove);
    domNode.ownerDocument.removeEventListener('mouseup', this.onMouseUp);
    domNode.ownerDocument.removeEventListener('touchmove', this.onTouchMove);
    domNode.ownerDocument.removeEventListener('touchend', this.onTouchEnd);
  }

  render() {
    return (
      <div>
        <Grid>
          <PageHeader>
            Carousel
          </PageHeader>
          <Row className="show-grid">
            <Col>
              <div style={{ position: 'relative' }}>
                <div
                  ref={el => this.movableRef = el}
                  style={{ height: '100px', width: '100px', border: '2px solid black', transform: `translate(${this.state.offset + this.state.dragOffset}px, 0px)` }}
                  onMouseDown={this.onMouseDown}
                  onTouchStart={this.onTouchStart}
                />
              </div>
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
