import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Grid, Row, Col, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

class NavLayout extends Component {
  static propTypes = {
    children: PropTypes.node,
    history: PropTypes.shape({
      replace: PropTypes.func,
    }),
  };

  handleSelect = page => {
    console.log('selected', page);
    // this.props.history.push(page);
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col>
            <PageHeader>
              <Nav bsStyle="tabs" activeKey="1" onSelect={this.handleSelect}>
                <NavItem eventKey="1" href="/home">NavItem 1 content</NavItem>
                <NavItem eventKey="2" title="Item">NavItem 2 content</NavItem>
                <NavItem eventKey="3" disabled>NavItem 3 content</NavItem>
                <NavDropdown eventKey="4" title="Dropdown" id="nav-dropdown">
                  <MenuItem eventKey="4.1">Action</MenuItem>
                  <MenuItem eventKey="4.2">Another action</MenuItem>
                  <MenuItem eventKey="4.3">Something else here</MenuItem>
                  <MenuItem divider />
                  <MenuItem eventKey="4.4">Separated link</MenuItem>
                </NavDropdown>
              </Nav>
            </PageHeader>
          </Col>
        </Row>
        <Row>
          <Col>
            {this.props.children}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default NavLayout;
