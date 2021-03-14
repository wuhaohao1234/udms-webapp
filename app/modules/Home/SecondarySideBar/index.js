'use strict';
import React from 'react';
import classes from './index.scss';
// import menu from './conf/menu.yml';

export default class SecondarySideBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state ={
      active: 0
    }
  }
  goRouter = (event) => {
    app.router.push(event.target.dataset.target)
  }
  render() {
    return (
      <div onMouseLeave={this.props.hideSideBar} className={classes['root']}>
        <ul>
          {
            this.props.subMenu.map((item,index) => {
              return (
                // <li data-target={item.url} className={index === this.state.active ? classes['active']: ''} onClick={this.goRouter} key={index} >
                <li data-target={item.url} onClick={this.goRouter} key={index} >
                  {item.title}
                </li>
              )
            })
          }
        </ul>
      </div>
    );
  }
}