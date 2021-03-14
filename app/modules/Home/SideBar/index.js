'use strict';

import React from 'react';
import SecondarySideBar from '../SecondarySideBar';
import classes from './index.scss';

import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});
import menu from '@app/conf/menu.yml';
export default class SideBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showSideBar: false,
      selectMenuIndex: null,
      active: 0
    }
  }

  showSideBar = (event) => {
    this.setState({
      selectMenuIndex: parseInt(event.currentTarget.dataset.index),
    })
  }
  hideSideBar = () => {
    this.setState({
      selectMenuIndex: null,
    })
  }
  render() {
    return <>
      <div className={classes['root']} onMouseEnter={this.hideSideBar.bind(this)} >
        <div className={classes['logo']} >
          <span>
            平台
          </span>
        </div>

        <ul>
          {
            menu.map((item,index) => {
              return (
                <li
                  key={index}
                  onMouseEnter={this.showSideBar}
                  className={index === this.state.active ? classes['active'] : ''}
                  data-index={index}
                >
                  <div className="icon" style={{ marginBottom: '4px' }} >
                    <IconFont style={{fontSize: '26px'}} type="iconxitongshezhi" />
                    {/* <SnippetsFilled /> */}
                  </div>
                  {item.title}
                </li>
              )
            })
          }
        </ul>
      </div>
      {
        this.state.selectMenuIndex !== null ?
          (<SecondarySideBar subMenu={menu[this.state.selectMenuIndex].subMenu} hideSideBar={this.hideSideBar} />)
          : null
      }
    </>;
  }
}