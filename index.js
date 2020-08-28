const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const themePath = core.getInput('theme-path');
  console.log(`Theme Path: ${themePath}!`);
  console.log(fs.readFileSync('./README.md', 'utf-8'));
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}