'use strict';

import React from 'react';
import classnames from 'classnames';
//import { MDCLinearProgress } from '@material/linear-progress';

export default class GlobalProgressBar extends React.PureComponent {
  state = {
    isGlobalProgressBarVisible: app.isGlobalProgressVisible(),
  };

  constructor(props) {
    super(props);
    //this._progressBarRef = React.createRef();
  }

  onGlobalProgressBarDisplayChanged = visible => {
    this.setState({
      isGlobalProgressBarVisible: visible,
    });
  };

  componentDidMount() {
    app.on('APP::GLOBAL_PROGRESS_BAR_DISPLAY_CHANGED', this.onGlobalProgressBarDisplayChanged);
    //this._progressBar = new MDCLinearProgress(this._progressBarRef.current);
  }

  componentWillUnmount() {
    app.off('APP::GLOBAL_PROGRESS_BAR_DISPLAY_CHANGED', this.onGlobalProgressBarDisplayChanged);
    // if (this._progressBar) {
    //   this._progressBar.destroy();
    // }
  }

  render() {
    return (
      <div
        id="progressbar"
        role="progressbar"
        ref={this._progressBarRef}
        className={
          classnames(
            'mdc-linear-progress',
            'mdc-linear-progress--indeterminate',
            { 'mdc-linear-progress--closed': !this.state.isGlobalProgressBarVisible }
          )}>
        <div className="mdc-linear-progress__buffering-dots"></div>
        <div className="mdc-linear-progress__buffer"></div>
        <div className="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
          <span className="mdc-linear-progress__bar-inner"></span>
        </div>
        <div className="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
          <span className="mdc-linear-progress__bar-inner"></span>
        </div>
      </div>
    );
  }
}