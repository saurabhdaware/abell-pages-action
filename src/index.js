const core = require('@actions/core');
const build = require('./build.js');

try {
  // build({
  //   sitePath: core.getInput('site-path'),
  //   deployBranch: core.getInput('deploy-branch'),
  //   shouldCommit: true
  // })

  // local run
  build({
    sitePath: 'example',
    deployBranch: null,
    shouldCommit: false
  })
} catch (err) {
  core.setFailed(err.message);
}