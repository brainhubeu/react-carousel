/**
 * @copyright 2015, Andrey Popp <8mayday@gmail.com>
 * @flow
 */

import * as React from 'react';
import PropTypes from 'prop-types';

type Props = {
  name: string,
  className?: string,
  size?: 'lg' | '2x' | '3x' | '4x' | '5x',
  rotate?: '45' | '90' | '135' | '180' | '225' | '270' | '315',
  flip?: 'horizontal' | 'vertical',
  fixedWidth?: boolean,
  spin?: boolean,
  pulse?: boolean,
  stack?: '1x' | '2x',
  inverse?: boolean,
  Component: React.ElementType,
};

export default class Icon extends React.Component<Props> {
  static propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    size: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
    rotate: PropTypes.oneOf(['45', '90', '135', '180', '225', '270', '315']),
    flip: PropTypes.oneOf(['horizontal', 'vertical']),
    fixedWidth: PropTypes.bool,
    spin: PropTypes.bool,
    pulse: PropTypes.bool,
    stack: PropTypes.oneOf(['1x', '2x']),
    inverse: PropTypes.bool,
    Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  };

  static defaultProps = {
    Component: 'span',
  };

  render() {
    const {
      Component,
      name,
      size,
      rotate,
      flip,
      spin,
      fixedWidth,
      stack,
      inverse,
      pulse,
      className,
      ...props
    } = this.props;
    let classNames = `fa fa-${name}`;
    if (size) {
      classNames = `${classNames} fa-${size}`;
    }
    if (rotate) {
      classNames = `${classNames} fa-rotate-${rotate}`;
    }
    if (flip) {
      classNames = `${classNames} fa-flip-${flip}`;
    }
    if (fixedWidth) {
      classNames = `${classNames} fa-fw`;
    }
    if (spin) {
      classNames = `${classNames} fa-spin`;
    }
    if (pulse) {
      classNames = `${classNames} fa-pulse`;
    }

    if (stack) {
      classNames = `${classNames} fa-stack-${stack}`;
    }
    if (inverse) {
      classNames = `${classNames} fa-inverse`;
    }

    if (className) {
      classNames = `${classNames} ${className}`;
    }
    return <Component {...props} className={classNames} />;
  }
}
