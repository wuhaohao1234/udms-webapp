'use strict';

export default (options = {}) =>
  app.callApi('GET','/api/role/check-role-name',{
    version: '1.x',
    carryToken: true,
    ...options,
  })