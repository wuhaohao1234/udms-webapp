'use strict';

import React from 'react';
import cs from 'classnames';
import { Table as AntTable, Space } from 'antd';

export default class Table extends React.PureComponent {
  static defaultProps = {
    topLeftActions: [],
    topRightActions: [],
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      topLeftActions, 
      topRightActions,
      dataSource,
      scrollY,
      rowSelection,
      style,
      className,
    } = this.props;

    const columns = this.props.columns.map(col => {
      return {
        ellipsis: true,
        width: 100,
        ...col,
      }
    });
    return (
      <div
        className={cs(className)}
        style={{
          backgroundColor: 'white',
          borderRadius: '4px',
          ... style
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 16px'
          }}>
          <Space size="middle">
            {topLeftActions}
          </Space>
          <Space size="middle">
            {topRightActions}
          </Space>
        </div>
        <AntTable
          size="middle"
          rowSelection={rowSelection}
          dataSource={dataSource}
          columns={columns}
          pagination={{
            size: "default",
            showSizeChanger: true
          }}
          scroll={{ x: true, y: scrollY }}
        />
      </div>
    );
  }
}