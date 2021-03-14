import React from 'react';
import classes from './index.scss'
import { Button,Table,Space,Tag,Divider } from 'antd'

import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
// import arrayToTree from 'array-to-tree'

export default class TableUser extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: []
    }
  }
  editCompany = (record) => {
    return () => {
      this.props.editCompany(record.key)
    }
  }
  deleteCompany = (record) => {
    return () => {
      this.props.deleteUser(record.key)
    }
  }
  copy = (record) => {
    return () => {
      this.props.copyUser(record)
    }
  }
  addUser = () => {
    this.props.addUser()
  }
  columns = [
    {
      title: '工号',
      dataIndex: '',
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
      render: tags => (
        <>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag.id} >
                {tag.name}
              </Tag>
            );
          })}
        </>
      ),
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
    {
      title: '操作',
      dataIndex: 'operating',
      key: 'key',
      render: (text,record) => {
        return (
          <div>
            <a onClick={this.editCompany(record)} >编辑</a>
            <Divider type="vertical" />
            <a onClick={this.copy(record)} >复制</a>
            <Divider type="vertical" />
            <a >重置密码</a>
            <Divider type="vertical" />
            <a onClick={this.deleteCompany(record)} >删除</a>
          </div>

        )
      },
    },
  ];

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  }
  deleteUser = () => {
    console.log(this.state.selectedRowKeys)
    this.props.deleteUser(this.state.selectedRowKeys)
  }
  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={classes['root']}>
        {/* button */}
        <div 
          style={{
            flex: 'none'
          }} 
          className={classes['feature-button']} >
          <Space size="middle" >
            <Button icon={<PlusOutlined />} onClick={this.addUser} type="primary">添加</Button>
            <Button type="">启用</Button>
            <Button type="">停用</Button>
            <Button type="">重置密码</Button>
            <Button onClick={this.deleteUser} >删除</Button>
          </Space>
        </div>
        {/* table */}
        <div style={{ flex: 'auto',overflow: 'auto',height:'100%' }} >
          <Table 
            rowSelection={rowSelection}
            rowKey='key'
            size="middle"
            columns={this.columns}
            dataSource={this.props.userList}
            pagination={{
              size: "default",
              showSizeChanger: true
            }}
             />
        </div>
      </div>
    )
  }
}