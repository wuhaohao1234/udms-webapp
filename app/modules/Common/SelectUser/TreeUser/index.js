import React from 'react';
import classes from './index.scss'
import { Form,Button,Select,Input ,TreeSelect } from 'antd'
import arrayToTree from 'array-to-tree'
import getHierarchyAll from '@api/hierarchy/all'

export default class TreeUser extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hierarchyArr: [],
      queryStr: ''
    }
  }
  componentDidMount() {
    // getAllUser()
    let arr = []
    getHierarchyAll().then(([err,res]) => {
      res.forEach(item => {
        arr.push({
          title: item.name,
          parent_id: item.parent_id,
          id: item.id,
          key: item.id,
          value: item.id
        })
      });
      this.setState({
        hierarchyArr: arrayToTree(arr)
      })
    })
  }
  onChange = (value) => {
    this.props.findListById(value)
  }
  changeQuery = event => {
    this.setState({
      queryStr: event.target.value
    })
  }
  query = () => {
    this.props.queryUser(this.state.queryStr)
  }
  render() {
    return (
      <div className={classes['root']} >
        <div className={classes['search-user']} >
          <Form style={{ display: 'flex' }} >
            <Form.Item label="所属部门" className={classes['search-user-form']} >
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400,overflow: 'auto' }}
              treeData={this.state.hierarchyArr}
              placeholder="选择公司"
              treeDefaultExpandAll
              onChange={this.onChange}
            />
            </Form.Item>
            <Form.Item label="员工信息" className={classes['search-user-form']} >
              <Input onChange={this.changeQuery} />
            </Form.Item>
            <Form.Item className={classes['search-user-form']}  >
              <Button onClick={this.query} type="primary">查询</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}