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
  const parsedRootPresets = parsePresets(presets, webpackRC.presets);
  const parsedPresets = parsePresets(presets, parsedEnv.presets);

  return merge.apply(null, [rootConfig, commonConfig].concat(parsedRootPresets).concat([
    parsedEnv
  ]).concat(config).concat(parsedPresets));
}

function parsePresets(presetDefinition, presets) {
  if(!presets) {
    return;
  }

  return presets.map((preset) => {
    if(preset.indexOf('(') >= 0) {
      const parts = preset.split('(');

      return presetDefinition[parts[0]](parts[1].split(')')[0]);
    }

    return presetDefinition[preset];
  });
}
