const inquirer       = require('inquirer');
const getGithubToken = require('./get-github-token');
const questions      = require('./questions');

exports.getCredentials = function getCredentials (callback) {
  inquirer.prompt(questions.getCredentials).then(callback);
}

exports.getTwoFactorCode = function getTwoFactorCode (callback) {
  inquirer.prompt(questions.getTwoFactorCode).then(callback);
}

exports.authenticateUser = function authenticateUser (github, callback) {
  getGithubToken(github, function (err, token) {
    if (err) {
      return callback(err);
    }
    github.authenticate({
      type: 'oauth',
      token
    });
    return callback(null, token);
  });
}
