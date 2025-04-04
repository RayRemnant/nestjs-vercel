const fs = require('fs');
const path = require('path');
const { Chalk } = require('chalk');

const chalk = new Chalk({ level: 1 });

const logFileNotFound = (fileName) =>
  console.log(chalk.yellow('❔ NOT FOUND'), chalk.bold(fileName));

const logFileAlreadyUpdated = (fileName) =>
  console.log(chalk.green('ℹ️  OK'), chalk.bold(fileName));

const logFileUpdated = (fileName) =>
  console.log(chalk.blue('🔄 UPDATE OK'), chalk.bold(fileName));

const logFileCreated = (fileName) =>
  console.log(chalk.green('✅ CREATED OK'), chalk.bold(fileName));

const logParseFailed = (fileName, errorMessage) =>
  console.log(
    chalk.red('❌ PARSE FAIL'),
    chalk.bold(fileName),
    '\n',
    errorMessage,
  );
