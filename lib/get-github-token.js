const _           = require('lodash');
const Preferences = require('preferences');
const CLI         = require('clui');
const Spinner     = CLI.Spinner;
const githubAuth = require('./github-authentication');

module.exports = function getGithubToken (github, callback) {
  // see if we have a github token in storage already
  const prefs = new Preferences('ginit');
  if (prefs.github && prefs.github.token) {
    return callback(null, prefs.github.token);
  }

  console.info('First, we to get an access token for GitHub.\nThis is a one-time process.');
  githubAuth.getCredentials(function (credentials) {
    const status = new Spinner('Talking to GitHub, please wait...');
    status.start();
    talkToGithub(null, function (err, token) {
      if (err) {
        callback(err);
      }
      return callback(null, token);
    });

    // CLOSURE FUNTIMES
    function talkToGithub (twoFactorCode, callback) {

      github.authenticate(
        _.extend(
          { type: 'basic' },
          credentials
        )
      );
      let baseArgs = {
        scopes: ['user', 'public_repo', 'repo', 'repo:status'],
        note: 'ginit, a command-line tool to inititialise Git repos'
      };
      if (twoFactorCode) {
        baseArgs = _.extend(
          baseArgs,
          {
            headers: {
              'X-GitHub-OTP': twoFactorCode
            }
          }
        );
      }

      github.authorization.create(baseArgs, function (err, res) {
        status.stop();
        if (err) {
          console.error(err);
          if (err.code == 401) {
            // CHECK FOR TWO-FACTOR AUTH
            if (err.headers['x-github-otp']) {
              githubAuth.getTwoFactorCode(function (data) {
                return talkToGithub(data.code, callback);
              });
            } else {
              // Standard 401 error
              return callback(err);
            }
          } else {
            // Standard error
            return callback(err);
          }
        } else {
          if (res.data.token) {
            prefs.github = {
              token: res.data.token
            };
            return callback(null, res.data.token);
          }
          return callback(err);
        }
      });
    }
  });
}
