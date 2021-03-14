'use strict';

import React from 'react';
import { Switch, Route ,Redirect} from 'react-router-dom';
import Hierarchy from '@modules/System/Hierarchy';
import User from '@modules/System/User';
import Permission from '@modules/System/Permission';
import Role from '@modules/System/Role';

import RoleDetail from '@modules/System/RoleDetail';
import classes from './index.scss';

export default class Main extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className={classes['root']}>
        <Switch>
          <Redirect from="/" exact  to={"/system/hierarchy"} />
          <Route exact path="/system/hierarchy" component={Hierarchy} />
          <Route exact path="/system/user" component={User} />
          <Route exact path="/system/permission" component={Permission} />
          <Route exact path="/system/role" component={Role} />
          <Route exact path="/system/roleDetail" component={RoleDetail} />
        </Switch>
      </div>
    );
  }
}