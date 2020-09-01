const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const process = require('process');

const core = require('@actions/core');
const { rmdirRecursiveSync } = require('./helpers');

const gitSetup = `
git add .abell docs
git commit -m "abell site commited to the repository" --no-verify --author abell-bot<bot@abelljs.org>
git push https://github.com/${process.env.GITHUB_REPOSITORY} ${core.getInput('deploy-branch')}:gh-pages --force
`;

// const gitSetup = ''

async function main() {
  let sitePath = core.getInput('site-path') || 'https://github.com/abelljs/abell-starter-minima';

  if (sitePath.startsWith('https://github.com')) {
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

  let meta = core.getInput('meta-path');

  if (!meta) {
    meta = {};
  } else {
    meta = require(meta);
  }

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


  {

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

try {
  main();
} catch (err) {
  core.setFailed(err.message);
}