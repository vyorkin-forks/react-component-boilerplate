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

process.env.BABEL_ENV = TARGET;

const commonConfig = {
  plugins: [
    new SystemBellPlugin()
  ]
};
const evaluate = evaluatePresets.bind(null, webpackPresets, webpackrc, TARGET);

if (TARGET === 'start') {
  module.exports = evaluate(merge(commonConfig, {
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
  module.exports = evaluate(merge(commonConfig, {
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

module.exports = evaluate(commonConfig);
