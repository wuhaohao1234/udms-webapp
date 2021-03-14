'use strict';

export default (options = {}) =>
  app.callApi('POST','/api/role/delete',{
    version: '1.x',
    carryToken: true,
    ...options,
  })