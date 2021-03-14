'use strict';

export default (options = {}) =>
  app.callApi('GET', '/api/hierarchy/all', {
    version: '1.x',
    carryToken: true,
    ...options,
  })