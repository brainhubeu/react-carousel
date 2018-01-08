import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NavLink from '../components/NavLink';

import '../styles/NavLayout.scss';

class NavLayout extends Component {
  static propTypes = {
    children: PropTypes.node,
    history: PropTypes.shape({
      replace: PropTypes.func,
    }),
  };

  render() {
    return (
      <div className="NavLayout">
        <div className="NavLayout__header">
          <NavLink to="/" >Home</NavLink>
          <NavLink to="/simple" >Simple uncontrolled</NavLink>
          <NavLink to="/controlled" >Controlled</NavLink>
          <NavLink to="/perpage" >Items per page</NavLink>
          <NavLink to="/clicktochange" >Click to change</NavLink>
          <NavLink to="/arrows" >Arrows</NavLink>
          <NavLink to="/responsive" >Responsive</NavLink>
          <NavLink to="/animation" >Animation</NavLink>
          <NavLink to="/autoplay" >Autoplay</NavLink>
        </div>
        <div className="NavLayout__content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default NavLayout;
