'use strict';

export default (options = {}) =>
  app.callApi('POST','/api/user-role/add',{
    version: '1.x',
    carryToken: true,
    ...options,
  })