'use strict';

export default (options = {}) =>
  app.callApi('GET','/api/user/find-by-hierarchy-id',{
    version: '1.x',
    carryToken: true,
    ...options,
  })