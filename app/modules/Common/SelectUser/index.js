import React from 'react';
import classes from './index.scss'
import findListByHierachy from '@api/user/find-list-by-hierarchy-id'

import TreeUser from './TreeUser'
import TableUser from './TableUser'

import { Modal } from 'antd';
import arrayToTree from 'array-to-tree'

import getHierarchyAll from '@api/hierarchy/all'
export default class SelectUser extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      employeeInformation: '',
      hierarchyArr: [],
      hierarchyId: null, // 选择的公司
      userList: [],
      userId: 0,
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


  componentDidMount() {
    getHierarchyAll().then(([err,res]) => {
      let arr = []
      res.forEach(item => {
        arr.push({
          title: item.name,
          parent_id: item.parent_id,
          id: item.id,
          key: item.id,
          value: item.id
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
        hierarchy_id: parseInt(hierarchyId),
        search_text
      }
    }).then(([err,res]) => {
      let arr = []
      let index = this.state.hierarchyArr.findIndex(item => item.id === this.state.hierarchyId)
      let company = this.state.hierarchyArr[index]
      res.forEach(item => {
        arr.push({
          jobNumber: item.id,
          key: item.id,
          name: item.real_name,
          phone: item.phone_number,
          department: company.name,
          roles: item.registre_name,
          status: item.status || 0,
          creation_time: item.creation_time || '',
        })
      })
      console.log(arr)
      this.setState({
        userList: arr
      })
    })
  }
  changeSelectedRowKey = (arr) => {
    this.setState({
      selectedRowKeys: arr
    })
  }
  handleCancel = () => {
    this.props.handleCancel()
  }
  handleOk = () => {
    this.props.handleOk(this.state.selectedRowKeys)
  }
  render() {
    return (
      <Modal
        title="选择员工"
        visible={this.props.visible}
        // visible={true}
        width="1200px"
        onOk={this.handleOk}
        okText="确定"
        cancelText="取消"
        onCancel={this.handleCancel}
      >
        {/* form */}
        <TreeUser
          queryUser={this.queryUser}
          findListById={this.findListById} />
        <TableUser
          changeSelectedRowKey={this.changeSelectedRowKey}
          userList={this.state.userList}
        />
      </Modal>
    )
  }
}