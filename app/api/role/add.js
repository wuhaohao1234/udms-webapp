'use strict';

export default (options = {}) =>
  app.callApi('POST','/api/role/add',{
    version: '1.x',
    carryToken: true,
    ...options,
  })