'use strict';

const path_ = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = env => {
  const isProd = env.MODE === 'production';
  const isDevServer = process.env.WEBPACK_DEV_SERVER == 'true';
  const isAnalyzing = env.ANALYZE == 'true';
  const noSourceMap = env.SOURCEMAP == 'false'

  let conf = {};
  try {
    conf = yaml.safeLoad(fs.readFileSync(path_.join(__dirname, 'dev.config.yml'), 'utf-8'));
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }

  const exports = {
    entry: './app/index.js',
    output: {
      filename: `hash/${isDevServer ? '[name]' : 'bundle.[contenthash]'}.js`,
      chunkFilename: `hash/${isDevServer ? '[name]' : 'bundle.[contenthash]'}.chunk.js`,
      publicPath: '/',
      path: path_.resolve(__dirname, './dist'),
      pathinfo: !isProd,
    },
    optimization: {
      minimize: isProd,
      // Automatically split vendor and commons
      // https://twitter.com/wSokra/status/969633336732905474
      // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      // splitChunks: {
      //   chunks: 'all',
      //   name: true,
      // },
      // // Keep the runtime chunk separated to enable long term caching
      // // https://twitter.com/wSokra/status/969679223278505985
      // runtimeChunk: true,
    },
    resolve: {
      alias: {
        '@app': path_.resolve(__dirname, './app'),
        '@api': path_.resolve(__dirname, './app/api'),
        '@modules': path_.resolve(__dirname, './app/modules'),
        '@assets': path_.resolve(__dirname, './app/assets'),
        '@styles': path_.resolve(__dirname, './app/styles'),
        '@third_party': path_.resolve(__dirname, './app/third_party'),
        '@utils': path_.resolve(__dirname, './app/utils'),
      },
      modules: [/*'./modules',*/ './node_modules'],
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },
      ]
    },
    plugins: [
      new CaseSensitivePathsPlugin(),
      new ModuleNotFoundPlugin(__dirname),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': `'${env.MODE}'`,
        // 'process.env.SERVICE_URL': 
        //   isDevServer ? `'http://localhost'` : `'${appEnv.serviceUrl}'`,
      }),
    ],
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    stats: isDevServer ? {
      colors: true,
      children: false,
      chunks: false,
      chunkModules: false,
      modules: false,
      builtAt: false,
      entrypoints: false,
      assets: false,
      version: false
    } : undefined,
    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false
  };

  if (isProd) {
    exports.devtool = 'none';
    exports.mode = 'production';
  } else {
    //exports.entry.push(require.resolve('react-dev-utils/webpackHotDevClient'));
    //exports.devtool = false; //'inline-source-map'; // cheap-module-source-map  source-map
    exports.devtool = noSourceMap && 'source-map';
    exports.mode = 'development';
  }

  const cssLoaders = (useModule, useScss = true, useLess = false) => [
    isDevServer ? {
      loader: "style-loader",
    } : {
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: false,
          sourceMap: !isProd
        }
      },
    {
      loader: 'css-loader',
      options: {
        modules: useModule,
        sourceMap: !isProd,
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: !isProd,
        plugins: () => [autoprefixer()]
      }
    },
    useScss ? {
      loader: 'sass-loader',
      options: {
        implementation: require('sass'),
        sassOptions: {
          includePaths: ['./app/styles', './app/third_party', 'node_modules'],
        },
        sourceMap: !isProd,
        webpackImporter: false,
      }
    } : undefined,
    useLess ? {
      loader: 'less-loader',
      options: {
        lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
          modifyVars: {
            'primary-color': '#5882f0',
            'error-color': '#ff4d4f',
            'heading-color': '#262626',
            'text-color': '#262626',
            'text-color-secondary': '#8c8c8c',
            'link-color': '#5882f0',
            'border-radius-base': '0px',
          },
          javascriptEnabled: true,
        },
      }
    } : undefined,
  ].filter(Boolean);

  exports.module.rules.push(
    {
      resource: path_.join(__dirname, 'app/index.html'),
      loader: 'ref-loader',
    },
    {
      test: /\.(yml|yaml)$/,
      use: [

        path_.join(__dirname, 'utils/yaml-loader'),
      ]
    },
    {
      test: /\.(png|jpg|tga|svg|gif|woff|woff2|eot|ttf|otf|mp4|mp3|ogg|avi|mov)$/,
      loader: 'file-loader',
      options: {
        name: '[contenthash].[ext]',
        outputPath: 'hash'
      },
    },
    {
      test: /\.css$/,
      use: cssLoaders(false),
    },
    {
      resource: path_.resolve(__dirname, './app/styles/index.scss'),
      use: cssLoaders(false),
    },
    {
      test: /\.scss$/,
      include: [
        path_.resolve(__dirname, './app/third_party')
      ],
      use: cssLoaders(false),
    },
    {
      test: /\.scss$/,
      include: [
        path_.resolve(__dirname, './app/modules'),
      ],
      use: cssLoaders(true),
    },
    {
      test: /\.less$/,
      use: cssLoaders(false, false, true),
    },
    {
      test: /\.(js|mjs|jsx)$/,
      exclude: /(node_modules|bower_components)/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: !isProd,
            cacheCompression: !isProd,
            //compact: isProd,
            babelrc: true,
            configFile: false,
          }
        },
        {
          loader: 'eslint-loader',
          options: {
            eslintPath: 'eslint',
            //formatter: 'codeframe',
            //formatter: require("eslint/lib/formatters/stylish"),
            formatter: require('react-dev-utils/eslintFormatter'),
            cache: !isProd,
          },
        },
      ]
    },
  );

  // exports.plugins.push(new webpack.SourceMapDevToolPlugin({
  //   exclude: /node_modules/,
  //   filename: '/hash/[name].js.map',
  // }));

  exports.plugins.push(new HtmlWebpackPlugin({
    inject: 'body',
    template: './app/index.html',
    filename: './index.html',
    minify: isProd && {
      minimize: true,
      removeConments: true,
      collapseWhitespace: true,
      minifyCSS: false,
      minifyJS: false,
    },
  }));

  exports.plugins.push(new MiniCssExtractPlugin({
    filename: 'hash/bundle.[contenthash].css',
    chunkFilename: 'hash/bundle.[contenthash].chunk.css',
  }));

  if (isAnalyzing) {
    exports.plugins.push(new BundleAnalyzerPlugin());
  }
  if (isProd && !isAnalyzing && !isDevServer) {
    exports.plugins.push(new CompressionPlugin({
      algorithm: 'gzip',
      compressionOptions: {
        level: 9
      },
    }));
  }
  exports.plugins.push(new CleanWebpackPlugin({
    cleanStaleWebpackAssets: true,
  }));

  if (isDevServer) {
    const devServer = conf.devServer || {};
    exports.devServer = {
      disableHostCheck: true,
      contentBase: exports.output.path,
      host: devServer.host || '0.0.0.0',
      port: devServer.port || 80,
      writeToDisk: true,
      hotOnly: true,
      open: devServer.open || undefined,
      proxy: {
        '/api': {
          target: (devServer.proxy && devServer.proxy.api) || '项目域名xxx',
          changeOrigin: true,
        }
      }
    };
    exports.plugins.push(new webpack.HotModuleReplacementPlugin());
  }
  return exports;
}