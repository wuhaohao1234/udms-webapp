'use strict';

import React from 'react';
import cx from 'classnames';
import styles from './index.scss';

export default class Container extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {leftBar, body, children} = this.props;
    return (
      <div
        className={cx(
          styles['root'], 
          leftBar && styles['root--left-bar']
        )}>
        {leftBar && React.cloneElement(leftBar, {
          className: cx(styles['left-bar'], leftBar.props.className)
        })}
        {React.cloneElement(body, {
          className: cx(
            styles['body'], 
            leftBar && styles['body--with-left-bar'],
            body.props.className)
        })}
        {children}
      </div>
    );
  }
}