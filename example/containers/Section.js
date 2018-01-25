import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter/prism';
import { coy } from 'react-syntax-highlighter/styles/prism';

import '../styles/Section.scss';

export default class Section extends Component {
  static propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    description: PropTypes.string,
    code: PropTypes.string,
  };

  render() {
    return (
      <section className="Section">
        <div className="Section__title">{this.props.title}</div>
        <div className="Section__description">{this.props.description}</div>
        <div className="Section__content">{this.props.children}</div>
        <div className="Section__code">
          <SyntaxHighlighter language="jsx" style={coy}>{this.props.code}</SyntaxHighlighter>
        </div>
      </section>
    );
  }
}
