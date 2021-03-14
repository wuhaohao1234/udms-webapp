import React from 'react';

import { Modal,Form,Input,message } from 'antd';

import { nanoid } from 'nanoid';
import { TreeSelect } from 'antd';
const TextArea = Input.TextArea

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};

const formLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};

export default class AddModal extends React.PureComponent {
  constructor(props) {
    super(props)
    this._formRef = React.createRef();
  }
  render() {
    const { parent_id,selectCompany,visible,hanldeClose,initialFormData } = this.props;
    return (
      <div>
        <Modal
          title={initialFormData.roleId ? '添加' : '编辑'}
          visible={visible}
          okText="确认"
          cancelText="取消"
          onCancel={() => hanldeClose(false)}
          onOk={() => {
            this._formRef.current
              .validateFields()
              .then(values => {
                this._formRef.current.resetFields();
                hanldeClose(true,values);
              })
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
              rules={[
                {
                  type: 'string',
                  max: '32',
                  message: '输入名称过长'
                }
              ]}
              name="name"
              label="名称">
              <Input placeholder="请输入组织名称，不超过20个字" />
            </Form.Item>
            <Form.Item name="parent_id" label="上级">
              <TreeSelect
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400,overflow: 'auto' }}
                treeData={this.props.arrTree}
                placeholder="选择上级"
                treeDefaultExpandAll
              />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  type: 'string',
                  max: '100',
                  message: '描述字符过长'
                }
              ]}
              name="desc"
              label="描述">
              <Input.TextArea placeholder="请填写组织描述" rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

// export default function (props) {
//   return (
//     <div>
//       <Modal
//         title="新增组织"
//         visible={props.visible}
//         onOk={props.handleAddCompany}
//         okText="确认"
//         cancelText="取消"
//         onCancel={props.cancelAdd}
//       >
//         <Form
//           labelAlign="right"
//           {...layout}
//         >
//           <Form.Item
//             label="名称"
//           >
//             <Input value={props.hierachyName} onChange={props.changeHierachyName} placeholder="请输入组织名称，不超过20个字" />
//           </Form.Item>
//           <Form.Item
//             label="上级"
//           >
            // <TreeSelect
            //   style={{ width: '100%' }}
            //   value={props.selectCompany}
            //   dropdownStyle={{ maxHeight: 400,overflow: 'auto' }}
            //   treeData={props.arrTree}
            //   placeholder="选择公司"
            //   treeDefaultExpandAll
            //   onChange={props.onSelect}
            // />
//           </Form.Item>
//           <Form.Item
//             label="描述"
//           >
//             <TextArea onChange={props.changeHierachyDescription} placeholder="请填写组织描述" rows={4} />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   )
// }