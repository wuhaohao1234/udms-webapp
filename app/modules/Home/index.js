'use strict';

import React from 'react';
import SideBar from './SideBar';
import Header from './Header';
import Main from './Main';
import classes from './index.scss';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <>
      <SideBar />
      <Header />
      <Main />
    </>;
  }
}