'use strict';

export default (options = {}) =>
  app.callApi('POST','/api/hierarchy/add',{
    version: '1.x',
    carryToken: true,
    ...options,
  })