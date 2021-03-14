'use strict';

import React from 'react';
import { Modal, Input, Form, message } from 'antd';

const formLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};

export default class AddEditModal extends React.PureComponent {
  _formRef = React.createRef();
  constructor(props) {
    super(props);
  }

  afterClose = () => {
    this._formRef.current.resetFields();
  };

  render() {
    const { 
      title, 
      visible, 
      hanldeClose, 
      initialFormData,
      formProps,
    } = this.props;
    return (
      <Modal
        title={title}
        visible={visible}
        okText="确认"
        cancelText="取消"
        afterClose={this.afterClose}
        onCancel={() => {
          if (hanldeClose) {
            hanldeClose(false);
          }
        }}
        onOk={() => {
          this._formRef.current
            .validateFields()
            .then(values => {
              if (hanldeClose) {
                hanldeClose(true, values);
              }
            })
            .catch(info => {
              message.error(info);
            });
        }}
      >
        <Form
          ref={this._formRef}
          labelAlign="right"
          formProps=
          {...formLayout}>
          <Form.Item name="name" label="名称">
            <Input placeholder="请输入角色名称，不超过20个字" />
          </Form.Item>
          <Form.Item name="desc" label="描述">
            <Input.TextArea placeholder="请填写组织描述" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}