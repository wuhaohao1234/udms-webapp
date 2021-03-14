'use strict';

import React from 'react';
import { Modal,Input,Form,message } from 'antd';
import callUpdateRole from '@api/role/update';
import callAddRole from '@api/role/add';
import checkRoleName from '@api/role/check-role-name'

const formLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

export default class AddEditModal extends React.PureComponent {
  _formRef = React.createRef();
  state = {};

  constructor(props) {
    super(props);
  }

  static getDerivedStateFromProps(nextProps,prevState) {
    const createMode = !nextProps.initialFormData.id;
    if (createMode != prevState.createMode) {
      return {
        createMode,
      };
    }
    return null;
  }

  submitForm = (values) => {
    if (!values.desc) {
      values.desc = ''
    }
    const { initialFormData,hanldeClose } = this.props;
    if (!this.state.createMode) {
      callUpdateRole({
        data: {
          id: initialFormData.id,
          name: values.name || '',
          desc: values.desc || '',
        }
      }).then(([error]) => {
        if (error)
          return;

        hanldeClose(true,values);
      });
    } else {
      callAddRole({ data: values }).then(([error]) => {
        if (error)
          return;

        hanldeClose(true,values);
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this._formRef.current.resetFields();
    }
  }

  render() {
    const { createMode } = this.state;
    const { visible,hanldeClose,initialFormData } = this.props;
    console.log(initialFormData)
    return (
      <Modal
        forceRender
        title={createMode ? '创建角色' : '编辑角色'}
        visible={visible}
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          if (hanldeClose) {
            hanldeClose(false);
          }
        }}
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
          initialValues={initialFormData}
          ref={this._formRef}
          labelAlign="right"
          {...formLayout}>
          <Form.Item
            name="name"
            label="名称"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: '请填写名称'
              },
              {
                type: 'string',
                max: 20,
                message: "名称不能超过20个字符"
              },
              ({ getFieldValue }) => ({
                validator(rule,value) {
                  if (!value) return Promise.resolve('')
                  return checkRoleName ({
                    params: {
                      role_name: value
                    }
                  }).then(([err,res]) => {
                    if (initialFormData.roleId) {
                      return Promise.resolve('账号合适')
                    }
                    if (res.available) {
                      console.log('账号合适')
                      return Promise.resolve('账号合适')
                    } else {
                      return Promise.reject('账号重复')
                    }
                  })
                },
              }),
            ]}>
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                type: 'string',
                max: 100,
                message: '角色描述不能大于100个字符'
              },
            ]}
            name="desc" label="描述">
            <Input.TextArea placeholder="请填写角色描述" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}