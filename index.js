const fs = require('fs');
const path = require('path');

const core = require('@actions/core');
const abellRenderer = require('abell-renderer');
const { Remarkable } = require('remarkable');
const md = new Remarkable();


async function commitDocs() {
  await exec("git", [
    "config",
    "--global",
    "user.email",
    "abell-bot@example.com",
  ]);
  await exec("git", ["config", "--global", "user.name", "abell-bot"]);
  await exec("git", ['add', 'docs']);
  await exec("git", [
    "commit",
    "--no-verify",
    "-m",
    "docs commited to the repository"
  ]);
  await exec("git", ["push"]);
};


async function main() {
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
  
  console.log('Created Docs site 🚀');
  await commitDocs();
  console.log('Committed to branch');
}

try {
  main();
} catch (error) {
  core.setFailed(error.message);
}