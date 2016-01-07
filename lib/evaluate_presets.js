import path from 'path';

import merge from 'webpack-merge';

import resolvePaths from './resolve_paths';

export default function evaluatePresets(webpackPresets, webpackRC, target, ...config) {
  const parsedEnv = webpackRC.env[target] || {};
  const commonConfig = webpackRC.common[target.split(':')[0]] || {};
  const paths = resolvePaths(
    path.join(__dirname, '..'),
    Object.assign({}, webpackRC.paths, commonConfig.paths, parsedEnv.paths)
  );
  const presets = webpackPresets(paths);
  const rootConfig = {
    resolve: {
      extensions: ['']
    }
  };
  const parsedRootPresets = webpackRC.presets.map((preset) => presets[preset]);
  const parsedPresets = parsedEnv.presets && parsedEnv.presets.map((preset) => presets[preset]);

  return merge.apply(null, [rootConfig, commonConfig].concat(parsedRootPresets).concat([
    parsedEnv
  ]).concat(config).concat(parsedPresets));
}
