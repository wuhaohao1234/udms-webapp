'use strict';

export default (options = {}) =>
  app.callApi('GET','/api/role/get',{
    version: '1.x',
    carryToken: true,
    ...options,
  })