// Don't change any of these values as they have to be this way for action to run

const fs = require('fs');

let githubData = {};

if (fs.existsSync('./githubData.json')) {
  githubData = require('./githubData.json');
}

let userGlobalMeta = {};
if (fs.existsSync('../globalMeta.json')) {
  userGlobalMeta = require('../globalMeta.json');
}

module.exports = {
  contentPath: "layout",
  themePath: "layout",
  outputPath: "../docs",
  globalMeta: {
    userReadmeURL: "../../README.md",
    github: githubData,
    ...userGlobalMeta
  }
};