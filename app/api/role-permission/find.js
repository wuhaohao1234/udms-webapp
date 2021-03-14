'use strict';

export default (options = {}) =>
  app.callApi('GET', '/api/role-permission/find', {
    version: '1.x',
    carryToken: true,
    ...options,
  });