'use strict';
import { createFromIconfontCN } from '@ant-design/icons';

import React from 'react';

const IconFont = createFromIconfontCN({
  // 替换为公司的iconfont地址 
  scriptUrl: '//at.alicdn.com/t/font_1870196_p2anl91qmij.js',
});
export default function Iconfont(props) {
  const style = {
    color: props.color || 'none'
  }
  return (
    <IconFont style={style} type={props.icon} />
  )
}