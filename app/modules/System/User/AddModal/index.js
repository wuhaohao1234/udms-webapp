import React from 'react';

import { Modal,Form,Input,message,Select } from 'antd';

import upsertUserById from '@api/user/upsertUserById'

import { nanoid } from 'nanoid';
import { TreeSelect } from 'antd';
import getAllRole from '@api/role/all'
import checkRegisterName from '@api/user/check-register-name'
const { Option } = Select;

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const regPhone = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/

export default class AddModal extends React.PureComponent {
  constructor(props) {
    super(props)
    this._formRef = React.createRef();
    this.state = {
      role: []
    }
  }
  componentDidMount() {
    getAllRole().then(([err,res]) => {
      this.setState({
        role: res
      })
    })
  }
  submitForm = (value) => {
    console.log(value.roles)
    // console.log(value.parent_id)
    let roles = value.roles.map(item => item.value)
    upsertUserById({
      data: {
        id: parseInt(value.code),
        register_name: value.register,
        real_name: value.name,
        password: value.password,
        phone_number: value.phone,
        hierarchy_id: value.parent_id,
        roles: roles
      }
    }).then(([err,res]) => {
      if (err) {
        return
      }
      this.props.handleClose(true)
      // this.findListById(this.state.hierarchyId)
    })
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this._formRef.current.resetFields();
    }
  }
  render() {
    const { arrTree,visible,initialFormData } = this.props;
    return (
      <Modal
        forceRender
        title={initialFormData.roleId ? '编辑' : '添加'}
        visible={visible}
        okText="确认"
        cancelText="取消"
        onCancel={() => this.props.handleClose(false)}
        onOk={() => {
          this._formRef.current
            .validateFields()
            .then(this.submitForm)
            .catch(info => {
              message.error(info);
            });
        }}
      >
        <Form
          key={nanoid()}
          initialValues={initialFormData}
          ref={this._formRef}
          labelAlign="right"
          {...formLayout}>
          <Form.Item
            name="code"
            label="员工编号">
            <Input disabled={initialFormData.roleId} placeholder="员工编号" />
          </Form.Item>

          <Form.Item
            name="register"
            validateTrigger="onBlur"
            rules={[
              { required: true,message: '请输入账号!' },
              { type: 'string',max: 16,message: '账号长度不能超过16位' },
              ({ getFieldValue }) => ({
                validator(rule,value) {
                  if(initialFormData.roleId) return Promise.resolve('')
                  if(!value) return Promise.resolve('')
                  return checkRegisterName({
                    params: {
                      register_name: value
                    }
                  }).then(([err,res]) => {
                    if(initialFormData.roleId) {
                      return Promise.resolve('账号合适')
                    }
                    if (res.available) {
                      console.log('账号合适')
                      return Promise.resolve('账号合适')
                    } else {
                      return Promise.reject('账号重复')
                    }
                  })
                  // return Promise.reject('账号重复');
                },
              }),
            ]}
            label="注册账号">
            <Input disabled={initialFormData.roleId} placeholder="注册账号" />
          </Form.Item>
          <Form.Item name="name"
            rules={[{ required: true,message: '请输入员工姓名!' }]}
            label="员工姓名">
            <Input placeholder="请输入角色名称，不超过20个字" />
          </Form.Item>
          <Form.Item name="phone"
            rules={[{ pattern: regPhone,message: '请输入手机号' }]}
            label="联系电话">
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item name="roles" label="所属角色">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              labelInValue={true}
              placeholder="Please select"
            >
              {
                this.state.role.map(item => (
                  <Option key={item.id} value={item.id} >
                    {item.name}
                  </Option>
                ))
              }
              <Option value="jack">Jack</Option>
            </Select>
          </Form.Item>

          <Form.Item name="parent_id" label="所属部门">
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400,overflow: 'auto' }}
              treeData={arrTree}
              placeholder="选择公司"
              treeDefaultExpandAll
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="登录密码"
            rules={[
              { required: initialFormData.roleId,message: '请输入密码!' },
              { type: 'string',min: 6,max: 32,message: '密码长度必须在6到32内' }
            ]}
          >
            <Input.Password placeholder="8-20位字母组合" />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
