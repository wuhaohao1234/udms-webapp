'use strict';

export default (options = {}) =>
  app.callApi('post','/api/user/upsert',{
    version: '1.x',
    carryToken: true,
    ...options,
  })