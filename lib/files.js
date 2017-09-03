const fs = require('fs');
const path = require('path');

module.exports = {
  getCurrentDirectoryBase: function () {
    return path.basename(process.cwd())
  },
  directoryExists: function (filepath) {
    try {
      return fs.statSync(filepath).isDirectory()
    } catch (e) {
      return false;
    }
  }
};
