'use strict';

import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Tabs, message } from 'antd';
import classes from './index.scss';
import callGetRole from '@api/role/get';
import Permission from '../Permission';
import UserTable from './UserTable';
import SelectUser from '@modules/Common/SelectUser';
import callAddUserRole from '@api/user-role/add';

class RoleDetail extends React.PureComponent {
  constructor(props) {
    super(props);

    const query = new URLSearchParams(this.props.location.search);
    this.state = {
      selectUserModalVisible: false,

      roleId: Number(query.get('roleId')),
      roleName: '',
      roleDesc: '',
    };
  }

  componentDidMount() {
    callGetRole({
      params: { 
        id: this.state.roleId 
      }
    }).then(([error, data]) => {
      if (error) {
        return;
      }
      this.setState({
        roleName: data.name,
        roleDesc: data.desc,
      })
    });
  }

  /**
   * 添加成员
   */
  handleAddMember = () => {
    this.setState({
      selectUserModalVisible: true,
    });
  }

  /**
   * 选择成员选择完毕
   * @param {*} selectedUserIdList 
   */
  handleSelectUserModalOk = (selectedUserIdList) => {
    this.setState({
      selectUserModalVisible: false,
    });
    if (selectedUserIdList.length == 0) {
      return;
    }
    callAddUserRole({
      data: selectedUserIdList.map(x => { 
        return { 
          role_id: this.state.roleId,
          user_id: x,
        } 
      })
    }).then(([error, data]) => {
      if (error)
        return;
      message.success('添加成功');
    });
  }

  /**
   * 取消选择
   */
  handleSelectUserModalCancel = () => {
    this.setState({
      selectUserModalVisible: false,
    });
  }
  
  render() {
    const { roleId, roleName, roleDesc } = this.state;
    return (
      <div className={classes['root']} >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          <div>
            <span>角色名称：{roleName}</span>
            <span style={{ marginLeft: '48px' }}>角色描述：{roleDesc}</span>
          </div>
          <div>
            <Button type="primary" onClick={this.handleAddMember}> 添加成员</Button>
          </div>
        </div>

        <div style={{ marginTop: '12px' }}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="功能权限" key="1">
              <Permission roleId={roleId} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="员工列表" key="2">
              <UserTable roleId={roleId} />
            </Tabs.TabPane>
          </Tabs>
        </div>

        <SelectUser 
          visible={this.state.selectUserModalVisible}
          handleOk={this.handleSelectUserModalOk}
          handleCancel={this.handleSelectUserModalCancel}
          />
      </div>
    );
  }
}

export default withRouter(RoleDetail);