/**
 * @copyright 2015, Andrey Popp <8mayday@gmail.com>
 * @flow
 */

import * as React from 'react';
import PropTypes from 'prop-types';

type Props = {
  className?: string,
  size?: 'lg' | '2x' | '3x' | '4x' | '5x',
  children: React.Element<any>,
};

export default class IconStack extends React.Component<Props> {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
    children: PropTypes.node.isRequired,
  };

  render() {
    let {className, size, children, ...props} = this.props;

    let classNames = ['fa-stack'];

    if (size) {
      classNames.push(`fa-${size}`);
    }

    if (className) {
      classNames.push(className);
    }

    const iconStackClassName = classNames.join(' ');

    return (
      <span {...props} className={iconStackClassName}>
        {children}
      </span>
    );
  }
}
