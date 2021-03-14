'use strict';

export default (options = {}) =>
  app.callApi('GET','/api/user/find-by-role-id',{
    version: '1.x',
    carryToken: true,
    ...options,
  })