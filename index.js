const util = require('util');
const exec = util.promisify(require('child_process').exec);
const process = require('process');

const core = require('@actions/core');

const gitSetup = `
git config --global user.email bot@abelljs.org
git config --global user.name abell-bot
git add docs
git commit -m "docs commited to the repository" --no-verify
git push https://github.com/${process.env.GITHUB_REPOSITORY} ${core.getInput('deploy-branch')}:gh-pages --force
`;


async function main() {
  const sitePath = core.getInput('site-path') || 'example';

  let meta = core.getInput('meta-path');

  console.log(process.env);

  if (!meta) {
    meta = {};
  } else {
    meta = require(meta);
  }

  {
    try {
      const {stdout, stderr} = await exec(`cd ${sitePath} && npx abell build`); 
      if (stdout) console.log(stdout);
      if (stderr) core.setFailed(stderr);
      console.log('Created Docs site 🚀');
    } catch (err) {
      core.setFailed(err.message);
    }

  }


  {

    try {
      const {stdout, stderr} = await exec(gitSetup);
      if (stdout) console.log(stdout);
      if (stderr) core.setFailed(stderr);

      console.log('Setting up git');
      console.log('Committed to branch 🌻');
    } catch (err) {
      core.setFailed(err.message);
    }
  }

}

try {
  main();
} catch (err) {
  core.setFailed(err.message);
}