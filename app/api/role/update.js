'use strict';

export default (options = {}) =>
  app.callApi('POST','/api/role/update',{
    version: '1.x',
    carryToken: true,
    ...options,
  })