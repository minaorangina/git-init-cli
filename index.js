const chalk            = require('chalk');
const clear            = require('clear');
const figlet           = require('figlet');
const GitHubApi        = require('github');
const { authenticateUser } = require('./lib/github-authentication');
const createRepo       = require('./lib/create-repo');
const setupRepo        = require('./lib/setup-repo');
const createGitignore  = require('./lib/create-gitignore');

clear();

console.log(
  chalk.green(
    figlet.textSync('Ginit', { horizontalLayout: 'full' })
  )
);

const github = new GitHubApi({
  version: '3.0.0'
});

authenticateUser(github, function (err, token) {
  if (err) {
    console.error(err);
    switch (err.code) {
      case 401:
        console.log(chalk.red('Couldn\'t log you in. Please try again.'));
        break;
      case 422:
        console.log(chalk.red('You already have an access token.'));
        break;
    }
  }
  if (token) {
    console.log(chalk.green('Successfully authenticated'));
    createRepo(github, function (err, url) {
      if (err) {
        console.error('Whoops...something went wrong');
      }
      console.log(url)
        createGitignore(function () {

          console.log("about to setup repo")
          setupRepo(url, function (err) {
            if (err) {
              console.error(chalk.red('Something went wrong'))
            }
            console.log(chalk.green('All done!'));
          });
        });
    });
  }
});
