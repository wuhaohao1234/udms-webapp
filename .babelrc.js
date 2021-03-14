'use strict';

module.exports = {
  presets: [
    /*'@babel/preset-env',*/
    '@babel/preset-react'
  ],
  plugins: [
    // [
    //   "babel-plugin-import", {
    //     "libraryName": "antd-mobile",
    //     "style": "es",
    //   }
    // ],
    '@babel/plugin-transform-runtime',
    [
      '@babel/plugin-proposal-decorators', {
        legacy: true,
        //decoratorsBeforeExport: false,
      }
    ],
    [
      '@babel/plugin-proposal-class-properties', {
        loose: true,
      }
    ]
  ],
}