'use strict';

export default (options = {}) =>
  app.callApi('POST', '/api/role-permission/reset', {
    version: '1.x',
    carryToken: true,
    ...options,
  });