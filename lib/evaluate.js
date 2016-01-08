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
  const actions = Object.assign({}, webpackActions(paths), webpackFormats(paths));
  const rootConfig = {
    resolve: {
      extensions: ['']
    }
  };
  const parsedRootActions = parseActions(actions, webpackRC.actions);
  const parsedActions = parseActions(actions, parsedEnv.actions);

  return merge.apply(null, [rootConfig, commonConfig].concat(parsedRootActions).concat([
    parsedEnv
  ]).concat(config).concat(parsedActions));
}

function parseActions(actionDefinition, actions) {
  if(!actions) {
    return;
  }

  return actions.map((action) => {
    if(action.indexOf('(') >= 0) {
      const parts = action.split('(');

      return actionDefinition[parts[0]](parts[1].split(')')[0]);
    }

    return actionDefinition[action];
  });
}
