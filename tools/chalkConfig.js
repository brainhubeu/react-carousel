// Centralized configuration for chalk, which is used to add color to console.log statements.
const chalk = require('chalk');

module.exports = {
  chalkError: chalk.red,
  chalkSuccess: chalk.green,
  chalkWarning: chalk.yellow,
  chalkProcessing: chalk.blue,
};
