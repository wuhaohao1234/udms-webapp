'use strict';

const yaml = require('js-yaml');

module.exports = function (src, map, meta) {
  try {
    const doc = yaml.safeLoad(src);
    const dst = `module.exports = ${JSON.stringify(doc)}`;
    this.callback(undefined, dst, map, meta);
  } catch (e) {
    this.callback(e);
  }
};