import React from 'react';
import classes from './index.scss'
import { Button,Table } from 'antd'

// import arrayToTree from 'array-to-tree'

export default class TableUser extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
    };
  }


  columns = [
    {
      title: '工号',
      dataIndex: 'register_name',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '角色',
      dataIndex: 'roles',
    },
    {
      title: '所属部门',
      dataIndex: 'department',
    },
    {
      title: '状态',
      dataIndex: 'status'
    },
    {
      title: '更新时间',
      dataIndex: 'creation_time',
    },
  ];

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ',selectedRowKeys);
    this.props.changeSelectedRowKey(selectedRowKeys)
    this.setState({ selectedRowKeys });
  };

  render() {
    const { loading,selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={classes['root']} >
        <Table rowSelection={rowSelection} rowKey='key' columns={this.columns} dataSource={this.props.userList} />
      </div>
    )
  }
}