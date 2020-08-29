const util = require('util');
const exec = util.promisify(require('child_process').exec);
const process = require('process');

const core = require('@actions/core');


// const gitSetup = (actor, token) => `
// machine github.com
// login ${actor}
// password ${token}
// machine api.github.com
// login ${actor}
// password ${token}
// `;

async function commitAndDeploy() {
  // await exec("git", [
  //   "config",
  //   "--global",
  //   "user.email",
  //   "abell-bot@example.com",
  // ]);
  // await exec("git", ["config", "--global", "user.name", "abell-bot"]);
  // await exec("git", ['checkout', 'gh-pages'])
  // await exec("git", ['add', 'docs']);
  // await exec("git", [
  //   "commit",
  //   "--no-verify",
  //   "-m",
  //   "docs commited to the repository"
  // ]);
  // await exec("git", ["push", 'origin', 'gh-pages']);
};


async function main() {
  const sitePath = core.getInput('site-path') || 'example';

  let meta = core.getInput('meta-path');
  console.log(Object.keys(process.env).sort());
  if (!meta) {
    meta = {};
  } else {
    meta = require(meta);
  }

  const {stdout, stderr} = await exec(`cd ${sitePath} && npx abell build`); 
  console.log(stdout);
  console.log(stderr);
  console.log('Created Docs site 🚀');
  await commitAndDeploy();
  console.log('Committed to branch');
}

try {
  main();
} catch (error) {
  core.setFailed(error.message);
}