import fs from 'fs';
import path from 'path';

import React from 'react';
import ReactDOM from 'react-dom/server';
import MTRC from 'markdown-to-react-components';

import pkg from '../package.json';

export default function renderJSX(demoTemplate, templateParams, compilation) {
  demoTemplate = demoTemplate || '';

  var tpl = fs.readFileSync(path.join(__dirname, '../lib/index_template.tpl'), 'utf8');
  var readme = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf8');
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
