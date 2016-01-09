import * as fs from 'fs';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import SystemBellPlugin from 'system-bell-webpack-plugin';
import Clean from 'clean-webpack-plugin';
import React from 'react';
import ReactDOM from 'react-dom/server';

import App from './demo/App.jsx';
import pkg from './package.json';

import webpackActions from './lib/actions';
import webpackFormats from './lib/formats';
import evaluate from './lib/evaluate';
import renderJSX from './lib/render_jsx.jsx';

const webpackrc = JSON.parse(fs.readFileSync('./.webpackrc', {
  encoding: 'utf-8'
}));

const RENDER_UNIVERSAL = true;

// XXX: prepush hook bug
const TARGET = process.env.npm_lifecycle_event || 'test';

process.env.BABEL_ENV = TARGET;

const commonConfig = {
  plugins: [
    new SystemBellPlugin()
  ]
};
const extraConfig = {
  start: {
    plugins: [
      new HtmlWebpackPlugin({
        title: pkg.name + ' - ' + pkg.description,
        templateContent: renderJSX
      })
    ]
  },
  'gh-pages': {
    plugins: [
      new Clean(['gh-pages']),
      new HtmlWebpackPlugin({
        title: pkg.name + ' - ' + pkg.description,
        templateContent: renderJSX.bind(
          null,
          RENDER_UNIVERSAL ? ReactDOM.renderToString(<App />) : ''
        )
      })
    ]
  }
}[TARGET] || {};

module.exports = evaluate(
  webpackActions, webpackFormats, webpackrc, TARGET, commonConfig, extraConfig
);
