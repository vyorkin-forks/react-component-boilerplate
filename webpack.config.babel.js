import fs from 'fs';
import path from 'path';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import SystemBellPlugin from 'system-bell-webpack-plugin';
import Clean from 'clean-webpack-plugin';
import merge from 'webpack-merge';
import React from 'react';
import ReactDOM from 'react-dom/server';

import App from './demo/App.jsx';
import pkg from './package.json';

import webpackPresets from './lib/presets';
import evaluatePresets from './lib/evaluate_presets';
import renderJSX from './lib/render_jsx.jsx';

const webpackrc = JSON.parse(fs.readFileSync('./.webpackrc', {
  encoding: 'utf-8'
}));

const RENDER_UNIVERSAL = true;
const TARGET = process.env.npm_lifecycle_event;
const ROOT_PATH = __dirname;

process.env.BABEL_ENV = TARGET;

const commonConfig = {
  plugins: [
    new SystemBellPlugin()
  ]
};
const paths = {
  entry: path.join(ROOT_PATH, 'demo'),
  jsx: [
    path.join(ROOT_PATH, 'demo'),
    path.join(ROOT_PATH, 'src')
  ],
  png: path.join(ROOT_PATH, 'demo'),
  jpg: path.join(ROOT_PATH, 'demo'),
  json: path.join(ROOT_PATH, 'package.json'),
  css: [
    path.join(ROOT_PATH, 'demo'),
    path.join(ROOT_PATH, 'style.css'),
    path.join(ROOT_PATH, 'node_modules/purecss'),
    path.join(ROOT_PATH, 'node_modules/highlight.js/styles/github.css'),
    path.join(ROOT_PATH, 'node_modules/react-ghfork/gh-fork-ribbon.ie.css'),
    path.join(ROOT_PATH, 'node_modules/react-ghfork/gh-fork-ribbon.css')
  ]
};
const evaluate = evaluatePresets.bind(null, webpackPresets, webpackrc, TARGET);

if (TARGET === 'start') {
  module.exports = evaluate(paths, merge(commonConfig, {
    entry: paths.entry,
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
      }),
      new HtmlWebpackPlugin({
        title: pkg.name + ' - ' + pkg.description,
        templateContent: renderJSX
      })
    ]
  }));
}

if (TARGET === 'gh-pages') {
  module.exports = evaluate(paths, merge(commonConfig, {
    entry: {
      app: paths.entry
    },
    plugins: [
      new Clean(['gh-pages']),
      new webpack.DefinePlugin({
          // This has effect on the react lib size
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new HtmlWebpackPlugin({
        title: pkg.name + ' - ' + pkg.description,
        templateContent: renderJSX.bind(
          null,
          RENDER_UNIVERSAL ? ReactDOM.renderToString(<App />) : ''
        )
      })
    ]
  }));
}

// !TARGET === prepush hook for test
if (TARGET === 'test' || TARGET === 'tdd' || !TARGET) {
  module.exports = evaluate(Object.assign({}, paths, {
    jsx: [
      path.join(ROOT_PATH, 'src'),
      path.join(ROOT_PATH, 'tests')
    ]
  }), commonConfig);
}

if (TARGET === 'dist' || TARGET === 'dist:min') {
  module.exports = evaluate(paths, commonConfig);
}
