'use strict';

export default (options = {}) =>
  app.callApi('POST','/api/hierarchy/delete',{
    version: '1.x',
    carryToken: true,
    ...options,
  })