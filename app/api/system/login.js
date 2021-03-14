'use strict';

export default (options = {}) =>
  app.callApi('POST', '/api/system/login', {
    version: '1.x',
    ...options,
  })
  .then(args => {
    const [err, data] = args;
    if (!err) {
      app.login(data);
    }
    return args;
  });