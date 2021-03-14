'use strict';

export default (options = {}) =>
  app.callApi('post','/api/user/delete',{
    version: '1.x',
    carryToken: true,
    ...options,
  })