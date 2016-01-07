import merge from 'webpack-merge';

export default function evaluatePresets(webpackPresets, webpackRC, target, paths, config = {}) {
  const parsedEnv = webpackRC.env[target];
  const commonConfig = webpackRC.common[target.split(':')[0]] || {};
  const presets = webpackPresets(paths);
  const rootConfig = {
    resolve: {
      extensions: ['']
    }
  };
  const parsedRootPresets = webpackRC.presets.map((preset) => presets[preset]);
  const parsedPresets = parsedEnv.presets && parsedEnv.presets.map((preset) => presets[preset]);

  return merge.apply(null, [rootConfig, commonConfig].concat(parsedRootPresets).concat([
    parsedEnv, config
  ]).concat(parsedPresets));
}
