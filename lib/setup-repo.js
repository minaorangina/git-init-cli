const git         = require('simple-git')();
const CLI         = require('clui');
const Spinner     = CLI.Spinner;

module.exports = function setupRepo (url, callback) {
  console.log("SETUP REPO")
  const status = new Spinner('Setting up the repository...');
  status.start();
  git
    .init()
    .add('.gitignore')
    .add('./*')
    .commit('Initial commit')
    .addRemote('origin', url)
    .push('origin', 'master')
    .then(function () {
      status.stop();
      return callback(null);
    });
}
