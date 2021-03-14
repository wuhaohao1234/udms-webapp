'use strict';

import React from 'react';
import { withRouter } from 'react-router-dom';
//import qs from 'qs';
import { Tree, Button, message } from 'antd';
import callResetPermissions from '@api/role-permission/reset';
import callFindRolePermission from '@api/role-permission/find';

class Permission extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      checkedKeys: [],
      rolePermissions: [],
    }
  }

  componentDidMount() {
    callFindRolePermission({
      params: {
        role_id: this.props.roleId,
      }
    }).then(([error, data]) => {
      if (error)
        return;
      const rolePermissions = new Set(data);
      const checkedKeys = new Set();
      const calc = (node) => {
        let checked = false;
        if (node.children) {
          checked = node.children.every(child => calc(child)); // 子菜单决定当前菜单是否选中
        } else {
          const perms = app.menu.getPermission(node.key);
          if (perms.length > 0) {
            checked = perms
              .every(perm => rolePermissions.has(perm)); // 角色拥有这个菜单的所有权限
          }
        }
        if (checked) {
          checkedKeys.add(node.key);
        }
        return checked;
      };
      const tree = app.menu.getDisplayTree();
      tree.forEach(calc);
      this.setState({
        treeData: tree,
        checkedKeys: Array.from(checkedKeys),
        //rolePermissions: Array.from(rolePermissions),
      });
    });
  }

  handleChecked = checkedKeys => {
    this.setState({
      checkedKeys,
    });
  };

  /**
   * 处理保存
   */
  handleSave = () => {
    const permissions = app.menu.getPermission(this.state.checkedKeys);
    callResetPermissions({
      data: {
        role_id: this.props.roleId,
        permissions,
      }
    }).then(([err]) => {
      if (err)
        return;
      message.success('保存成功');
    });
  };

  render() {
    const { treeData, checkedKeys } = this.state;
    return (
      <div>
        {treeData.length > 0 && 
          <Tree
            defaultExpandAll={true}
            checkable
            checkedKeys={checkedKeys}
            treeData={treeData}
            onCheck={this.handleChecked}
          />}
        <Button
          style={{
            marginTop: '16px'
          }}
          type="primary"
          onClick={this.handleSave}> 保存</Button>
      </div>
    );
  }
}

export default withRouter(Permission);