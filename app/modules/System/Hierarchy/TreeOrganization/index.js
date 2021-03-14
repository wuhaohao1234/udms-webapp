'use strict';

import React from 'react';
import { Tree,Input } from 'antd';
import classes from './index.scss'
import cs from 'classnames'
const { Search } = Input;

const TreeOrganization = (props) => {


  const onExpand = expandedKeys => {

  };

  const onSearch = e => {
    const { value } = e.target
    let resultArr = []
    props.hierarchyArr.forEach(item => {
      if (item.title.includes(value)) {
        resultArr.push(item)
      }
    });
    resultArr.forEach(item => {
      if (item.parent_id) {
        props.hierarchyArr.forEach(parent => {
          if (parent.id === item.parent_id) {
            resultArr.push(parent)
          }
        })
      }
    })
    resultArr = Array.from(new Set(resultArr))
    props.searchCompany(resultArr)

  }

  const onSelect = (selectedKeys,info) => {
    if(selectedKeys.length === 0) {
      return
    }
    props.selectHierachy(info.selectedNodes[0])
  };

  return (
    <div style={{ display: 'flex',flexFlow: 'column',background:'#fff',padding: '24px' }} className={cs(props.className,classes['tree'])}>
      <Search
        style={{ marginBottom: 8,flex: 'none' }}
        onChange={onSearch}
        placeholder="输入名称或编码查询" />
      <div
        style={{
          flex: 'auto',
          marginTop: '16px',
          // maxHeight: '100px',
          overflow: 'auto'
        }}
      >
        <Tree
          onExpand={onExpand}
          // className={classes['tree-pannel']}

          onSelect={onSelect}
          treeData={props.arrTree}
        />
      </div>

    </div>

  );
};
export default TreeOrganization