'use strict';

export default (options = {}) =>
  app.callApi('POST', '/api/hierarchy/update', {
    version: '1.x',
    carryToken: true,
    ...options,
  })