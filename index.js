const util = require('util');
const exec = util.promisify(require('child_process').exec);
const process = require('process');

const core = require('@actions/core');

const ref = process.env.GITHUB_REF;
const branch = ref.slice(ref.lastIndexOf('/') + 1);


const gitSetup = `
machine github.com
login ${process.env.GITHUB_ACTOR}
password ${process.env.GITHUB_TOKEN}
machine api.github.com
login ${process.env.GITHUB_ACTOR}
password ${process.env.GITHUB_TOKEN}
git config --global user.email bot@abelljs.org
git config --global user.name abell-bot
git add docs
git commit -m "docs commited to the repository" --no-verify
git push https://github.com/${process.env.GITHUB_REPOSITORY} ${branch}:gh-pages
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
      if (stderr) console.log(stderr);
      console.log('Created Docs site 🚀');
    } catch (err) {
      core.setFailed(err.message);
    }

  }


  {
    const {stdout, stderr} = await exec(gitSetup);
    if (stdout) console.log(stdout);
    if (stderr) console.log(stderr);

    console.log('Setting up git');
    console.log('Committed to branch 🌻');
  }

}

try {
  main();
} catch (err) {
  core.setFailed(err.message);
}