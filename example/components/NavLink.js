import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';

import '../styles/NavLink.scss';

class NavLink extends Component {
  static propTypes = {
    children: PropTypes.node,
    to: PropTypes.string,
  };

  render() {
    return (
      <RouterLink
        className="NavLink"
        activeClassName="NavLink--active"
        to={this.props.to}
        exact
      >
        {this.props.children}
      </RouterLink>
    );
  }
}

export default NavLink;
