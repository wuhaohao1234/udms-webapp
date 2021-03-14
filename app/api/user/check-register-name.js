'use strict';

export default (options = {}) =>
  app.callApi('get','/api/user/check-register-name',{
    version: '1.x',
    carryToken: true,
    ...options,
  })