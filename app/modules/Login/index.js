'use strict';

import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import Icon, { UserOutlined, LockOutlined } from '@ant-design/icons';
import classes from './index.scss';
import loginImg from './images/login-img.png'
import callLogin from '@api/system/login'
import { ApiError } from '@utils/errors'
import {InfoCircleFilled} from '@ant-design/icons'
import Iconfont from '@app/components/iconfont'
export default class Login extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPrompt: false,
      auth: '',
      password: ''
    }
  }

  handleFormFinished = (values) => {
    callLogin({
      payload: {
        auth: this.state.auth,
        mode: 'un',
        password: this.state.password
      },
      handleErrorCodes: [
        'ERR_LOGIN_FAILED'
      ]
    })
    .then(([err, data]) => {
      if(err) {
        if(err.code == 'ERR_LOGIN_FAILED') {
          this.setState({
            showPrompt: true,
          })
        }
        return
      }
      app.router.replace('/') 
    });
  };
  handleChange(event){
    this.setState({
      auth: event.target.value
    })
  }
  handleChangePass(event){
    this.setState({
      password: event.target.value
    })
  }
  render() {
    const errorShow = {
      color: '#ff4d4f'
    }
    return (
      <div className={classes['login-body']} >
        <div className={classes.root}>
          <div className={classes['login-img']} >
            <img src={loginImg} />
          </div>
          <div className={classes['login-content']} >
            <div className={classes['login-welcome']} >
              Hi！欢迎使用
            </div>
            <p>集团数字化管理平台</p>
            <Form
              name="normal_login"
              size="large"
              initialValues={{ remember: true }}
              onFinish={this.handleFormFinished}>
              <Form.Item
                name="username"
                className={classes['ant-form-item']}>
                <Input
                  value={this.state.auth}
                  onChange={this.handleChange.bind(this)}
                  prefix={<Iconfont icon="iconzhanghao" className="site-form-item-icon" />}
                  placeholder="请输入工号/手机号" />
              </Form.Item>
              <Form.Item
                name="password"
                className={classes['ant-form-item']}>
                <Input
                  value={this.state.password}
                  onChange={this.handleChangePass.bind(this)}
                  prefix={<Iconfont icon="iconmima" className="site-form-item-icon" />}
                  type="password"
                  placeholder="密码" />
              </Form.Item>
              <div style={errorShow} className={classes.prompt}>

                {this.state.showPrompt ? (<div><InfoCircleFilled /><span style={{marginLeft: '8px'}} >用户名或密码不正确</span></div>): ''}
              </div>
              <Form.Item>
                <Button type="primary" htmlType="submit" className={classes['btn-primary']} block>登录</Button>
                {/* Or <a href="">立即注册</a> */}
              </Form.Item>
            </Form>
          </div>
          <div className={classes['footer-title']} >Copyright ©2019西安信息科技有限公司     陕ICP备18021037号-3</div>
        </div>
      </div>
    );
  }
}