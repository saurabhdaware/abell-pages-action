const core = require('@actions/core');
const build = require('./build');

try {
  build({
    sitePath: core.getInput('site-path'),
    deployBranch: core.getInput('deploy-branch'),
    deployTo: 'gh-pages'
  })

  // local run
  // build({
  //   sitePath: 'example',
  //   deployBranch: null,
  //   deployTo: null
  // })
} catch (err) {
  core.setFailed(err.message);
}