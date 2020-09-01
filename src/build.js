const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const process = require('process');

const core = require('@actions/core');
const { rmdirRecursiveSync } = require('./helpers');


async function build({sitePath, deployBranch, shouldCommit}) {
  // Pre Build Setup
  if (sitePath.startsWith('https://github.com')) {
    // if sitePath is repository
    if (fs.existsSync('.abell')) {
      rmdirRecursiveSync('.abell');
    }

    try {
      const {stdout, stderr} = await exec(`git clone ${sitePath} .abell`);
      rmdirRecursiveSync('.abell/.git');
      if (stdout) console.log(stdout);
      if (stderr) console.log(stderr);
  
      sitePath = '.abell';
    } catch (err) {
      core.setFailed(err.message);
    }
  }
  
  // create github meta data
  const githubData = {
    repository: process.env.GITHUB_REPOSITORY,
    owner: process.env.GITHUB_REPOSITORY_OWNER
  }

  fs.writeFileSync(`./${sitePath}/githubData.json`, JSON.stringify(githubData, null, 2))

  // Run Abell Build
  {
    try {
      const {stdout, stderr} = await exec(`cd ${sitePath} && npx abell build`); 
      if (stdout) console.log(stdout);
      if (stderr) console.log(stderr);
      console.log('Created Docs site 🚀');
    } catch (err) {
      core.setFailed(err.message);
    }
  }

  // post-build cleanup
  fs.unlinkSync(`./${sitePath}/githubData.json`);

  if (sitePath === '.abell' && fs.existsSync('.abell')) {
    rmdirRecursiveSync('.abell');
  }


  // Configure git and commit to branch
  if (shouldCommit) {

    const gitSetup = `
      git config user.email bot@abelljs.org
      git config user.name abell-bot
      git add docs
      git commit -m "abell site commited to the repository" --no-verify
      git push https://github.com/${process.env.GITHUB_REPOSITORY} ${deployBranch}:gh-pages --force
    `;

    try {
      const {stdout, stderr} = await exec(gitSetup);
      if (stdout) console.log(stdout);
      if (stderr) console.log(stderr);

      console.log('Setting up git');
      console.log('Committed to branch 🌻');
    } catch (err) {
      core.setFailed(err.message);
    }
  }
}

module.exports = build;