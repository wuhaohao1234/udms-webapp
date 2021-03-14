'use strict';

import React from 'react';
import { Table, Button, Tabs } from 'antd';
import callFindUserByRoleId from '@api/user/find-by-role-id';

export default class UserTable extends React.PureComponent {
  _columns = [
    {
      title: '工号',
      dataIndex: 'register_name',
      key: 'register_name',
    },
    {
      title: '姓名',
      dataIndex: 'real_name',
      key: 'real_name',
    },
    {
      title: '手机号',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: '所属部门',
      dataIndex: 'hierarchy_name',
      key: 'hierarchy_name',
    },
    {
      title: '添加时间',
      dataIndex: 'rel_creation_time',
      key: 'rel_creation_time',
    },
  ]
  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
    };
  }

  componentDidMount() {
    callFindUserByRoleId({
      params: {
        role_id: this.props.roleId,
      }
    }).then(([error, data]) => {
      if (error) {
        return;
      }
      this.setState({
        dataSource: data,
      });
    });
  }

  render() {
    const { dataSource } = this.state;
    return (
      <Table 
        rowKey="id"
        size="middle"
        columns={this._columns}
        dataSource={dataSource} 
        pagination={{
          size: "default",
          showSizeChanger: true
        }}/>
    );
  }
}