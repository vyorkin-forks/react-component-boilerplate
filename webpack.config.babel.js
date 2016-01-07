import fs from 'fs';
import path from 'path';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import SystemBellPlugin from 'system-bell-webpack-plugin';
import Clean from 'clean-webpack-plugin';
import merge from 'webpack-merge';
import React from 'react';
import ReactDOM from 'react-dom/server';
import MTRC from 'markdown-to-react-components';

import App from './demo/App.jsx';
import pkg from './package.json';

import webpackPresets from './lib/presets';

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

if (TARGET === 'start') {
  module.exports = evaluatePresets(webpackrc, TARGET, paths, merge(commonConfig, {
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
  module.exports = evaluatePresets(webpackrc, TARGET, paths, merge(commonConfig, {
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
  module.exports = evaluatePresets(webpackrc, TARGET, Object.assign({}, paths, {
    jsx: [
      path.join(ROOT_PATH, 'src'),
      path.join(ROOT_PATH, 'tests')
    ]
  }), commonConfig);
}

if (TARGET === 'dist' || TARGET === 'dist:min') {
  module.exports = evaluatePresets(webpackrc, TARGET, paths, commonConfig);
}

function evaluatePresets(webpackrc, target, paths, config = {}) {
  const parsedEnv = webpackrc.env[target];
  const commonConfig = webpackrc.common[target.split(':')[0]] || {};
  const presets = webpackPresets(paths);
  const rootConfig = {
    resolve: {
      extensions: ['']
    }
  };
  const parsedRootPresets = webpackrc.presets.map((preset) => presets[preset]);
  const parsedPresets = parsedEnv.presets && parsedEnv.presets.map((preset) => presets[preset]);

  return merge.apply(null, [rootConfig, commonConfig].concat(parsedRootPresets).concat([
    parsedEnv, config
  ]).concat(parsedPresets));
}

function renderJSX(demoTemplate, templateParams, compilation) {
  demoTemplate = demoTemplate || '';

  var tpl = fs.readFileSync(path.join(__dirname, 'lib/index_template.tpl'), 'utf8');
  var readme = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8');
  var replacements = {
    name: pkg.name,
    description: pkg.description,
    demo: demoTemplate,
    documentation: ReactDOM.renderToStaticMarkup(
      <div key="documentation">{MTRC(readme).tree}</div>
    )
  };

  return tpl.replace(/%(\w*)%/g, function(match) {
    var key = match.slice(1, -1);

    return typeof replacements[key] === 'string' ? replacements[key] : match;
  });
}
