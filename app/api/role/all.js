'use strict';

export default (options = {}) =>
  app.callApi('GET','/api/role/all',{
    version: '1.x',
    carryToken: true,
    ...options,
  })