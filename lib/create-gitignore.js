const fs       = require('fs');
const _        = require('lodash');
const inquirer = require('inquirer');
const touch    = require('touch');

module.exports = function createGitignore (callback) {
  const filelist = _.without(
    fs.readdirSync('.'),
    '.git',
    '.gitignore'
  );

  if (filelist.length > 0) {
    inquirer.prompt(
      [
        {
          type: 'checkbox',
          name: 'ignore',
          message: 'Select the files and/or folders you wish to ignore:',
          choices: filelist,
          default: ['node_modules']
        }
      ]
    ).then(function (answers) {
      if (answers.ignore.length > 0) {
        fs.writeFileSync('.gitignore', answers.ignore.join('\n'));
      } else {
        touch('.gitignore');
      }
      return callback();
    })
  } else {
    touch('.gitignore');
    return callback();
  }
}
