'use strict';

import './index.css';
import 'antd/dist/antd.less';
import './styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './modules/App';
import AppController from './app';

window.app = new AppController();

ReactDOM.render(
  <App />,
  document.getElementById('app'));

if (module.hot) {
  module.hot.accept('./modules/App', function () {
    ReactDOM.render(
      <App />,
      document.getElementById('app'));
  });
}