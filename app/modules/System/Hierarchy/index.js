'use strict';

import React from 'react';
import getHierachy from '@api/hierarchy/all'
import addHierachy from '@api/hierarchy/add'
import deleteHierachy from '@api/hierarchy/delete'
import updateHierachy from '@api/hierarchy/update'
import arrayToTree from 'array-to-tree'


import Table from '@modules/Common/Table';
import TreeOrganization from './TreeOrganization'
import DeleteModal from './DeleteModal'
import AddModal from './AddModal'
import Cotainer from '@modules/Common/Container'
import { PlusOutlined,SyncOutlined } from '@ant-design/icons'
import { Button,message,Divider,Modal } from 'antd';

export default class Hierarchy extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      arrTree: [], //树形节点数组
      hierarchyArr: [], //原始数组
      privaeHierarchyArr: [], // 数组不可改变
      selectCompany: null, // 选择的公司
      // 对应弹窗
      addVisible: false,
      visibleDelete: false,
      updateVisible: false,

      hierachyName: '',
      hierachyDescriptions: '',
      deleteId: null,
      updateCompanyName: '',
      updateCompanyDescription: '',
      updateCompanyId: 0,
      initialFormData: {
        roleId: false,
        name: '',
        desc: '',
        parent_id: 250
      },
      selectedRowKeys: []
    }
  }
  componentDidMount() {
    this.getAllCompanyList()
  }
  // 搜索时重新赋值给arrTree
  searchCompany = (arr) => {
    this.setState({
      arrTree: arrayToTree(arr),
    })
  }
  // 根据company得到对应的子公司
  getChildrenCompany = (company) => {
    let arr = []
    if (company.children) {
      company.children.forEach(item => {
        let parent_name = ''
        if (item.parent_id) {
          this.state.privaeHierarchyArr.forEach(parent => {
            if (parent.id === item.parent_id) {
              parent_name = parent.title
            }
          })
        }
        arr.push({
          title: item.title,
          parent_id: item.parent_id,
          id: item.id,
          key: item.id,
          value: item.id,
          desc: item.desc,
          update_time: item.update_time,
          status: item.enable_status === 1 ? '启用' : '禁用',
          parent_name,
        })
      })
    }
    return arr
  }
  // 选择某一公司，记录选择的公司,表格展示对应的子公司
  selectHierachy = (company) => {
    this.setState({
      selectCompany: company.title,
      initialFormData: { parent_id: company.id },
      parent_id: company.id,
      hierarchyArr: this.getChildrenCompany(company),
      arrTree: arrayToTree(this.state.privaeHierarchyArr)
    })
  }
  // 添加公司
  addCompany = () => {
    this.setState({
      addVisible: true,
      hierachyName: '',
      initialFormData: { roleId: true,parent_id: this.state.parent_id }
    })
  }
  // id 为单一的或者是list
  deleteCompany = (id) => {
    if (Array.isArray(id) && id.length === 0) {
      message.warning('请选择一条数据');
      return
    }

    Modal.confirm({
      title: '请确定删除数据',
      okType: 'danger',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        deleteHierachy({
          data: {
            id
          }
        }).then(([error]) => {
          if (error)
            return;
          this.setState({
            selectedRowKeys: [],
          })
          this.getAllCompanyList()
          message.success('删除成功');
        });
      }
    });
  }
  // 设置树形组件，获取所有公司 arrTree为处理后的树形组件, hierarchyArr 为原始的数组
  getAllCompanyList = () => {
    let arr = []
    getHierachy().then(([err,res]) => {
      res.forEach(item => {
        arr.push({
          title: item.name,
          parent_id: item.parent_id,
          parent_name: item.parent_id ? 'xxx' : '',
          id: item.id,
          key: item.id,
          value: item.id,
          desc: item.desc,
          update_time: item.update_time,
          status: item.enable_status === 1 ? '启用' : '禁用',
        })
      });
      arr.forEach(item => {
        if (item.parent_id) {
          arr.forEach(parent => {
            if (parent.id === item.parent_id) {
              item.parent_name = parent.title
            }
          })
        }
      })
      // 这里根据当前条件做判断 
      // 数组第一位加入一个为null的元素
      this.setState({
        arrTree: arrayToTree(arr),
        hierarchyArr: arr,
        privaeHierarchyArr: arr
      })
      let resultArr = []
      if (this.state.parent_id) {
        arr.forEach(item => {
          if (item.parent_id === this.state.parent_id) {
            resultArr.push(item)
          }
        })
        this.setState({
          hierarchyArr: resultArr
        })
      }

    })
  }
  editCompany = (record) => {
    let id = record.id
    let index = this.state.hierarchyArr.findIndex(item => item.id === id)
    let item = this.state.hierarchyArr[index]
    this.setState({
      addVisible: true,
      updateCompanyId: item.id,
      initialFormData: { name: item.title,parent_id: item.parent_id,roleId: false },
    })
  }
  handleAddCompany = () => {

  }
  changeHierachyName = event => {
    this.setState({
      hierachyName: event.target.value
    })
  }
  changeHierachyDescription = event => {
    this.setState({
      hierachyDescriptions: event.target.value
    })
  }
  changeHierachyItem = parent_id => {
    this.setState({
      parent_id
    })
  }
  handleCancel = () => {
    this.setState({
      visibleDelete: false
    })
  }
  // 这里的id为数组或者单个字符
  handleDelete = () => {
    deleteHierachy({
      data: {
        id: this.state.deleteId
      },
      handleErrorCodes: [
        'ERR_IS_REFERENCED_ROW'
      ]
    }).then(([err,data]) => {
      if (err) {
        if (err.code === 'ERR_IS_REFERENCED_ROW') {
          message.error('删除失败,请先删除该组织架构下的子组织');
        }
      }
      else {
        console.log('删除')
        console.log(this)
        this.setState({
          deleteId: null
        })
        message.success('删除成功');
      }
      this.getAllCompanyList()
      this.setState({
        visibleDelete: false
      })
    })
  }
  cancelAdd = (finish,value) => {
    if (!finish) {
      this.setState({
        addVisible: false,
        hierachyName: ''
      })
      return
    }
    if (this.state.initialFormData.roleId) {
      console.log(value);
      addHierachy({
        data: {
          name: value.name,
          parent_id: value.parent_id,
          desc: value.desc
        }
      }).then(([err,res]) => {
        message.success('添加成功');
        this.setState({
          addVisible: false,
          hierachyName: ''
        })
        this.getAllCompanyList()
      })
    }
    else {
      updateHierachy({
        data: {
          name: value.name,
          id: this.state.updateCompanyId,
          desc: value.desc
        }
      }).then(([err,res]) => {
        message.success('修改成功');
        this.setState({
          addVisible: false,
          hierachyName: ''
        })
        this.getAllCompanyList()
      })
    }
  }
  columns = [
    {
      title: '编码',
      dataIndex: 'coding',
      width: 60,
    },
    {
      title: '名称',
      dataIndex: 'title',
      width: 100,
    },
    {
      title: '描述',
      dataIndex: 'desc',
      width: 100,
    },
    {
      title: '所属架构',
      dataIndex: 'parent_name',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 60
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      width: 120
    },
    {
      title: '操作',
      dataIndex: 'operating',
      key: 'key',
      render: (text,record) => {
        return (
          <div>
            <a onClick={() => this.editCompany(record)} >编辑</a>
            <Divider type="vertical" />
            {/* <a onClick={moveUpCompany} >上移</a> */}
            {/* <Divider type="vertical" /> */}
            {/* <a onClick={moveDownCompany} >下移</a> */}
            {/* <Divider type="vertical" /> */}
            <a onClick={() => this.deleteCompany(record.id)} >删除</a>
          </div>
        )
      },
    },
  ];
  onSelectChange = (select) => {
    this.setState({
      selectedRowKeys: select
    })

  }
  render() {
    return (
      <Cotainer
        leftBar={
          <TreeOrganization
            selectHierachy={this.selectHierachy}
            searchCompany={this.searchCompany}
            hierarchyArr={this.state.privaeHierarchyArr}
            arrTree={this.state.arrTree}
          />
        }
        body={
          <Table
            topLeftActions={[
              <Button key="1" type="primary" icon={<PlusOutlined />} onClick={this.addCompany}> 添加</Button>,
              <Button key="2" onClick={() => this.deleteCompany(this.state.selectedRowKeys)}> 删除</Button>
            ]}
            topRightActions={[
              <Button key="1" onClick={this.getAllCompanyList} type="text" icon={<SyncOutlined />}></Button>
            ]}
            rowSelection={{
              selectedRowKeys: this.state.selectedRowKeys,
              onChange: this.onSelectChange,
            }}
            dataSource={this.state.hierarchyArr}
            columns={this.columns}
            scrollY='calc(100vh - 286px)'
          />
          // <TableBanner
          //   editCompany={this.editCompany}
          //   deleteCompany={this.deleteCompany}
          //   addCompany={this.addCompany}
          //   hierarchyArr={this.state.hierarchyArr}
          //   refresh={this.getAllCompanyList}
          // />
        }
      >
        <AddModal
          visible={this.state.addVisible}
          hanldeClose={this.cancelAdd}
          initialFormData={this.state.initialFormData}
          selectCompany={this.state.selectCompany}
          arrTree={this.state.arrTree}
        />
        <DeleteModal
          visibleDelete={this.state.visibleDelete}
          handleCancel={this.handleCancel}
          handleDelete={this.handleDelete} />
      </Cotainer>
    );
  }
}