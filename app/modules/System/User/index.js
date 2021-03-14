import React from 'react';
import classes from './index.scss'
import findListByHierachy from '@api/user/find-list-by-hierarchy-id'

import Table from '@modules/Common/Table';
import TreeUser from './TreeUser'
import TableUser from './TableUser'
import DeleteModal from './DeleteModal'
import AddModal from './AddModal'

import arrayToTree from 'array-to-tree'

import deleteUserById from '@api/user/deleteUser'
import getHierarchyAll from '@api/hierarchy/all'
import { Tag,Divider,message,Button } from 'antd';
import { PlusOutlined,SyncOutlined } from '@ant-design/icons';
export default class User extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      employeeInformation: '',
      hierarchyArr: [],
      hierarchyId: null, // 选择的公司
      userList: [],
      visibleDelete: false,
      userId: 0,
      addVisible: false,
      initialFormData: {
        code: null,
        roleId: false,
        name: '',
        roles: [],
        parent_id: null,
        real_name: '',
        phone: ''
      },
      arrTree: [],
      queryStr: '',
      selectedRowKeys: []
    }
  }
  queryUser = (str) => {
    if (!this.state.hierarchyId) {
      console.log('请选择查询公司')
    }
    this.setState({
      queryStr: str
    })
    this.findListById(this.state.hierarchyId,str)
  }
  editCompany = (id,copy) => {
    const index = this.state.userList.findIndex(item => item.key === id)
    let user = this.state.userList[index]
    console.log(user.roles)
    this.setState({
      initialFormData: {
        roleId: copy ? false : true,
        code: copy ? null : id,
        register: user.register_name,
        roles: user.roles,
        name: user.name,
        phone: user.phone,
        parent_id: user.department
      },
      addVisible: true,
    })
  }
  deleteUser = (id) => {
    this.setState({
      userId: id,
      visibleDelete: true
    })
  }
  handleCancel = () => {
    this.setState({
      visibleDelete: false
    })
  }

  handleDelete = id => {
    console.log(this.state.userId)
    deleteUserById({
      data: {
        id: this.state.userId
      }
    }).then(([err,res]) => {
      if(err) {
        return
      }
      message.success('删除成功')
      this.findListById(this.state.hierarchyId)
      this.setState({
        selectedRowKeys: [],
        visibleDelete: false
      })
    })
  }
  // 添加
  addUser = () => {
    this.setState({
      addVisible: true,
      initialFormData: {
        roleId: false,
        parent_id: this.state.hierarchyId
      }
    })
  }

  componentDidMount() {
    this.findListById(null,'')
    getHierarchyAll().then(([err,res]) => {
      let arr = []
      res.forEach(item => {
        arr.push({
          title: item.name,
          parent_id: item.parent_id,
          id: item.id,
          key: item.id,
          value: item.id,

        })
      })
      this.setState({
        hierarchyArr: res,
        arrTree: arrayToTree(arr)
      })
    })
  }
  // 通过id获取对应table数据
  findListById = (hierarchyId,search_text) => {
    this.setState({
      hierarchyId,
      initialFormData: { parent_id: hierarchyId }
    })
    findListByHierachy({
      params: {
        hierarchy_id: hierarchyId? parseInt(hierarchyId): null,
        search_text
      }
    }).then(([err,res]) => {
      let arr = []
      res.forEach(item => {
        let rolesArr = []
        item.roles.forEach(role => {
          rolesArr.push({
            id: role.id,
            name: role.name,
            key: role.id
          })
        })
        arr.push({
          jobNumber: item.id,
          key: item.id,
          name: item.real_name,
          phone: item.phone_number,
          department: item.hierarchy_name,
          roles: rolesArr,
          register_name: item.register_name,
          status: item.status == 0 ? '禁用' : '启用',
          creation_time: item.creation_time || '',
        })
      })
      this.setState({
        userList: arr
      })
    })
  }
  refersh = () => {
    if (this.state.hierarchyId) {
      this.findListById(this.state.hierarchyId,this.state.queryStr)
    }
  }
  handleClose = finish => {
    if (finish) {
      this.refersh()
    }
    this.setState({
      addVisible: false
    })
  }
  copyUser = (record) => {
    this.editCompany(record.key,true)
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
            <a onClick={() => this.editCompany(record.key)} >编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.copyUser(record)} >复制</a>
            <Divider type="vertical" />
            <a >重置密码</a>
            <Divider type="vertical" />
            <a onClick={() => this.deleteUser(record.key)} >删除</a>
          </div>

        )
      },
    },
  ];
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  }
  render() {
    return (
      <div className={classes['root']} >
        {/* form */}
        <div>
          <TreeUser
            queryUser={this.queryUser}
            findListById={this.findListById} />
        </div>
        <Table
          style={{
            marginTop: '16px',
          }}
          topLeftActions={[
            <Button key="1" type="primary" icon={<PlusOutlined />} onClick={this.addUser}> 添加</Button>,
            <Button key="2" onClick={() => this.deleteUser(this.state.selectedRowKeys)}> 删除</Button>
          ]}
          topRightActions={[
            <Button key="1" type="text" icon={<SyncOutlined />}></Button>
          ]}
          rowSelection={{
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange,
          }}
          dataSource={this.state.userList}
          columns={this.columns}
          scrollY='calc(100vh - 385px)'
        />
        {/* <TableUser
          addUser={this.addUser}
          deleteUser={this.deleteUser}
          copyUser={this.copyUser}
          userList={this.state.userList}
          editCompany={this.editCompany}
        /> */}

        <AddModal
          arrTree={this.state.arrTree}
          visible={this.state.addVisible}
          handleClose={this.handleClose}
          initialFormData={this.state.initialFormData} />
        <DeleteModal
          handleCancel={this.handleCancel}
          visibleDelete={this.state.visibleDelete}
          handleDelete={this.handleDelete}
        />

      </div>
    )
  }
}