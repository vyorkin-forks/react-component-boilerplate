import path from 'path';

import merge from 'webpack-merge';

import resolvePaths from './resolve_paths';

export default function evaluate(webpackActions, webpackFormats, webpackRC, target, ...config) {
  const parsedEnv = webpackRC.env[target] || {};
  const commonConfig = webpackRC.common[target.split(':')[0]] || {};
  const paths = resolvePaths(
    path.join(__dirname, '..'),
    Object.assign({}, webpackRC.paths, commonConfig.paths, parsedEnv.paths)
  );
  const actions = webpackActions(paths);
  const formats = webpackFormats(paths);
  const rootConfig = {
    resolve: {
      extensions: ['']
    }
  };
  const parsedRootActions = parse(actions, webpackRC.actions);
  const parsedActions = parse(actions, parsedEnv.actions);
  const parsedRootFormats = parse(formats, webpackRC.formats);
  const parsedFormats = parse(formats, parsedEnv.formats);

  return merge.apply(null, [rootConfig, commonConfig].
    concat(parsedRootActions).concat(parsedRootFormats).concat([
      parsedEnv
    ]).concat(config).concat(parsedActions).concat(parsedFormats));
}

function parse(definition, items) {
  if(!items) {
    return;
  }

  return items.map((item) => {
    if(item.indexOf('(') >= 0) {
      const parts = item.split('(');

      return definition[parts[0]](parts[1].split(')')[0]);
    }

    return definition[item]();
  });
}
