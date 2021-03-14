import React from 'react';
import { Modal} from 'antd';
export default function DeleteModal(props) {
  return (
    <div>
      <Modal
        title="删除"
        visible={props.visibleDelete}
        onOk={props.handleDelete}
        onCancel={props.handleCancel}
        okText="确认"
        okButtonProps={{
          danger: true
        }}
        cancelText="取消"
      >
        <p>是否删除该公司?</p>
      </Modal>
    </div>
  )
}