'use strict';

module.exports = {
  parser: "babel-eslint",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  plugins: [
    "eslint-plugin-react",
  ],
  parserOptions: {
    ecmaVersion: 10,
    sourceType: "module",
    ecmaFeatures: {
      globalReturn: false,
      jsx: true,
      impliedStrict: true, // enable global strict mode (if ecmaVersion is 5 or greater)

      // for babel-eslint parser
      allowImportExportEverywhere: false,
      codeFrame: true
    },
  },
  env: {
    es6: true,
    browser: true,
    commonjs: true,
  },
  globals: {
    app: true,
    process: true,
    SERVICE_URL: true,
  },
  settings: {
    react: {
      createClass: "createReactClass", // Regex for Component Factory to use,
                                         // default to "createReactClass"
      pragma: "React",  // Pragma to use, default to "React"
      version: "detect", // React version. "detect" automatically picks the version you have installed.
                           // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
                           // default to latest and warns if missing
                           // It will default to "detect" in the future
      flowVersion: "0.53" // Flow version
    },
    propWrapperFunctions: [
        // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
        "forbidExtraProps",
        {"property": "freeze", "object": "Object"},
        {"property": "myFavoriteWrapper"}
    ],
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      "Hyperlink",
      {"name": "Link", "linkAttribute": "to"}
    ]
  },
  rules: {
    "semi": "off", // 分号
    "quotes": "off",
    "no-unused-vars": "off",
    "getter-return": "off",
    "no-extra-semi": "off",

    "react/display-name": "off",  // 组件显示命名
    "react/prop-types": "off",
  },
}