import path from 'path';

import merge from 'webpack-merge';

import resolvePaths from './resolve_paths';

export default function evaluate({actions, formats, webpackrc, target}, ...config) {
  const parsedEnv = webpackrc.env[target] || {};
  const commonConfig = webpackrc.common[target.split(':')[0]] || {};
  const paths = resolvePaths(
    path.join(__dirname, '..'),
    Object.assign({}, webpackrc.paths, commonConfig.paths, parsedEnv.paths)
  );
  const evaluatedActions = actions(paths);
  const evaluatedFormats = formats(paths);
  const rootConfig = {
    resolve: {
      extensions: ['']
    }
  };
  const parsedRootActions = parse(evaluatedActions, webpackrc.actions);
  const parsedActions = parse(evaluatedActions, parsedEnv.actions);
  const parsedRootFormats = parse(evaluatedFormats, webpackrc.formats);
  const parsedFormats = parse(evaluatedFormats, parsedEnv.formats);

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
