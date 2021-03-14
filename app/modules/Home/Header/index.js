'use strict';

import React from 'react';
import classes from './index.scss';
import { PageHeader } from 'antd';
import { Menu, Dropdown } from 'antd'
import { LogoutOutlined } from '@ant-design/icons';
import menuRouter from '@app/conf/header-title.yml';
import {
  withRouter
} from "react-router-dom"
import { DownOutlined } from '@ant-design/icons';
function signout() {
  app.logout()
}

function menu() {
  return (
    <Menu>
      {/* <Menu.Item >
        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
          修改密码
          </a>
      </Menu.Item> */}
      <Menu.Item onClick={signout} icon={<LogoutOutlined />}>
        退出登录
      </Menu.Item>
    </Menu>
  )
}

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      routes: [
        // {
        //   path: this.props.location.pathname,
        //   breadcrumbName: menuRouter[0].title,
        // },
      ]
    }
  }
  componentDidMount() {
    this.renderTree(this.props.location)
    this.cancelListener = app.router.listen((location) => {
      this.renderTree(location)
    })
  }
  renderTree = location => {
    this.setState({
      routes: menuRouter[location.pathname]
    })
  }
  componentWillUnmount() {
    this.cancelListener()
  }

  render() {
    return (
      <div className={classes['root']}>
        <PageHeader
          className="site-page-header"
          breadcrumb={{ routes: this.state.routes }}
        />
        <div className={classes['avatar']} >
          <div className={classes['avatar-img']} >
            <img src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" />
          </div>
          <div className={classes['avatar-name']} >
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                {app.getLoggedInUser().real_name}<DownOutlined />
              </a>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Header)