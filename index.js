const fs = require('fs');
const path = require('path');

const core = require('@actions/core');
const abellRenderer = require('abell-renderer');
const { Remarkable } = require('remarkable');
const md = new Remarkable();



try {
  const themePath = core.getInput('theme-path') || 'example/theme/index.abell';
  const basePath = path.dirname(themePath);

  const importContent = (mdPath) => {
    return md.render(fs.readFileSync(path.join(basePath, mdPath), 'utf-8'));
  } 

  let meta = core.getInput('meta-path');

  if (!meta) {
    meta = {};
  } else {
    meta = require(meta);
  }

  const abellTemplate = fs.readFileSync(themePath, 'utf-8');
  const htmlPath = abellRenderer.render(abellTemplate, {
    Abell: { meta, importContent }
  }, {
    allowRequire: true,
    basePath
  });
  
  fs.mkdirSync('docs');
  fs.writeFileSync('docs/index.html', htmlPath);
} catch (error) {
  core.setFailed(error.message);
}