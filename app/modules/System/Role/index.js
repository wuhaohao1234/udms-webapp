'use strict';

import React from 'react';
import { Button, Modal, Space, Divider,message } from 'antd';
import {PlusOutlined, SyncOutlined} from '@ant-design/icons';
import cx from 'classnames';
import Table from '@modules/Common/Table';
import AddEditModal from './AddEditModal';
import classes from './index.scss';
import callGetAllRoles from '@api/role/all';
import callDeleteRole from '@api/role/delete';

export default class Role extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      addOrEditModalVisible: false,
      initialAddOrEditFormData: {
        name: '',
        desc: ''
      },

      loadingData: false,
      selectedRowKeys: [],
      dataSource: [],
      columns: [
        {
          title: '角色名称',
          dataIndex: 'name',
          key: 'name',
          width: 120,
        },
        {
          title: '描述',
          dataIndex: 'desc',
          key: 'desc',
          width: 160,
        },
        {
          title: '所属机构',
          dataIndex: 'hierarchy',
          key: 'hierarchy',
          width: '180px',
        },
        {
          title: '成员数量',
          dataIndex: 'member_count',
          key: 'member_count',
          width: '100px',
        },
        {
          title: '状态',
          dataIndex: 'display_enable_status',
          key: 'display_enable_status',
          width: '100px',
        },
        {
          title: '更新时间',
          dataIndex: 'update_time',
          key: 'update_time',
          width: '240px',
        },
        {
          title: '操作',
          dataIndex: 'operating',
          key: '$',
          ellipsis: true,
          width: '260px',
          render: (text,record) => {
            return (
              <div>
                <a onClick={() => this.editRole(record)}>编辑</a>
                <Divider type="vertical" />
                <a onClick={() => this.handleSetPermission(record)}>设置权限</a>
                <Divider type="vertical" />
                <a onClick={() => this.copyRole(record)}>复制</a>
                <Divider type="vertical" />
                <a onClick={() => this.deleteRole(record)}>删除</a>
              </div>
            )
          },
        },
      ],
    }
  }

  componentDidMount() {
    this.refershRoleTable();
  }

  /**
   * 刷新列表
   */
  refershRoleTable = () => {
    return Promise.resolve()
      .then(() => {
        this.setState({
          loadingData: true,
        })
      })
      .then(() => {
        return callGetAllRoles()
          .then(([error, data]) => {
            if (error)
              return;
            
            this.setState({
              dataSource: data.map(item => {
                return {
                  id: item.id,
                  key: item.id,
                  name: item.name,
                  desc: item.desc,
                  update_time: item.update_time,
                  enable_status: item.enable_status,
                  display_enable_status: item.enable_status == 1 ? '启用' : '禁用',
                  member_count: item.member_count,
                  hierarchy: "hahahan3run3rin3risdvmdufgnturnyeqnyiqyqeyqeyqe"
                };
              })
            });
          });
      })
      .finally(() => {
        this.setState({
          loadingData: false,
        });
      })
  }

  /**
   * 点击设置角色权限按钮
   * @param {*} record 
   */
  handleSetPermission = (record) => {
    app.router.push('/system/roleDetail?roleId=' + record.key);
  };

  /**
   * 删除角色按钮点击
   * @param {*} record 
   */
  deleteRole = (record) => {
    Modal.confirm({
      title: '请确定删除数据',
      okType: 'danger',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        callDeleteRole({
          data: {
            id: record.id,
          }
        }).then(([error]) => {
          if (error)
            return;

          this.refershRoleTable();
          message.success('删除成功');
        });
      }
    });
  };

  /**
   * 编辑角色按钮点击
   * @param {*} record 
   */
  editRole = (record) => {
    this.setState({
      initialAddOrEditFormData: { ...record },
      addOrEditModalVisible: true
    });
  };

  /**
   * 拷贝角色按钮点击
   * @param {*} record 
   */
  copyRole = (record) => {
    record.id = null
    record.name += '副本'
    this.setState({
      initialAddOrEditFormData: { ...record },
      addOrEditModalVisible: true
    });
  };

  /**
   * 创建新的角色按钮点击
   */
  addRole = () => {
    this.setState({
      initialAddOrEditFormData: {},
      addOrEditModalVisible: true
    });
  };

  /**
   * 删除一组角色按钮点击
   */
  deleteRoles = () => {
    if (this.state.selectedRowKeys.length == 0) {
      message.warn('请选择一条数据');
      return;
    }
    Modal.confirm({
      title: '请确定删除数据',
      okType: 'danger',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        callDeleteRole({
          data: { 
            id: this.state.selectedRowKeys,
          }
        }).then(([error]) => {
          if (error)
            return;
          this.setState({
            selectedRowKeys: []
          })
          this.refershRoleTable();
          message.success('删除成功');
        });
      }
    });
  };
  
  /**
   * 角色表格选中状态发生改变
   * @param {*} selectedRowKeys 
   */
  onSelectChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys 
    });
  };

  /**
   * 创建或编辑对话框完成
   */
  handleAddOrEditModalClose = (ok, values) => {
    if (ok) {
      this.refershRoleTable();
      message.success('操作成功');
    }
    this.setState({
      addOrEditModalVisible: false,
    });
  };

  render() {
    const {
      addOrEditModalVisible, 
      initialAddOrEditFormData,
      loadingData,
      selectedRowKeys,
      dataSource,
      columns 
    } = this.state;

    return (
      <div 
        className={classes['root']} 
        style={{ 
          display: 'flex',
          flexFlow: 'column',
        }}>
        <Table
          topLeftActions={[
            <Button key="1" type="primary" icon={<PlusOutlined />} onClick={this.addRole}> 添加</Button>,
            <Button key="2" onClick={this.deleteRoles}> 删除</Button>
          ]}
          topRightActions={[
            <Button key="1" onClick={this.refershRoleTable} type="text" icon={<SyncOutlined />}></Button>
          ]}
          rowSelection={{
            selectedRowKeys,
            onChange: this.onSelectChange,
          }}
          dataSource={dataSource}
          columns={columns}
          scrollY='calc(100vh - 280px)'
          />
        <AddEditModal
          initialFormData={initialAddOrEditFormData}
          visible={addOrEditModalVisible}
          hanldeClose={this.handleAddOrEditModalClose}
          />
      </div>
    )
  }
}