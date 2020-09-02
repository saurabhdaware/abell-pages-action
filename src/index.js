const core = require('@actions/core');
const build = require('./build.js');

try {
  if (process.env.NODE_ENV === 'dev') {
    // local run
    build({
      sitePath: 'example',
      deployBranch: null,
      shouldCommit: false
    })
  } else {
    build({
      sitePath: core.getInput('site-path'),
      deployBranch: core.getInput('deploy-branch'),
      shouldCommit: true
    })
  }

} catch (err) {
  core.setFailed(err.message);
}