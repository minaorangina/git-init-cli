const inquirer    = require('inquirer');
const CLI         = require('clui');
const Spinner     = CLI.Spinner;
const questions   = require('./questions');
const {
  getCurrentDirectoryBase
} = require('./files');

module.exports = function createRepo (github, callback) {
  inquirer.prompt(questions.createRepo).then(function(answers) {
    const status = new Spinner('Creating repository...');
    status.start();

    const data = {
      name : answers.name,
      description : answers.description,
      private : (answers.visibility === 'private')
    };

    github.repos.create(
      data,
      function(err, res) {
        status.stop();
        if (err) {
          return callback(err);
        }
        console.log(res.data)
        return callback(null, res.data.clone_url);
      }
    );
  });
}
