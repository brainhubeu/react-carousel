import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NavLink from '../components/NavLink';
import routes from '../constants/routes';

import '../styles/NavLayout.scss';

class NavLayout extends Component {
  static propTypes = {
    children: PropTypes.node,
    history: PropTypes.shape({
      replace: PropTypes.func,
    }),
  }

  renderRoutes() {
    return routes.map(route => (
      <li key={route.path}>
        <NavLink to={route.path} >{route.name}</NavLink>
      </li>
    ))
  }

  render() {
    return (
      <div className="NavLayout">
        <ul className="NavLayout__header">
          {this.renderRoutes()}
        </ul>
        <div className="NavLayout__content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default NavLayout;
