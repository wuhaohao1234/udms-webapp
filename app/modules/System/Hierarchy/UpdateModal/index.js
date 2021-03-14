
import React from 'react';

import { Modal,Input,Form,TreeSelect } from 'antd';
const TextArea = Input.TextArea
export default function (props) {
  return (
    <div>

      <Modal
        title="编辑组织"
        visible={props.updateVisible}
        onOk={props.handleUpdate}
        okText="确认"
        cancelText="取消"
        onCancel={props.cancelUpdate}
      >
        <Form>
          <Form.Item
            label="*名称"
          >
            <Input 
              onChange={props.updateCompanyName} 
              placeholder="请输入组织名称，不超过20个字" 
            />
          </Form.Item>
          <Form.Item label="上级" >
            <TreeSelect
              style={{ width: '100%' }}
              value={props.selectCompany}
              dropdownStyle={{ maxHeight: 400,overflow: 'auto' }}
              treeData={props.arrTree}
              placeholder="选择公司"
              treeDefaultExpandAll
              onChange={props.onSelect}
            />
          </Form.Item>
          <Form.Item
            label="描述"
          >
            <TextArea onChange={props.updateCompanyDescription} placeholder="请填写组织描述" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}