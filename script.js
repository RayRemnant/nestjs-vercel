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

async function updateTsConfig() {
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');

  // if file does not exist, skip (user might not be using ts)
  if (!fs.existsSync(tsConfigPath)) return logFileNotFound('.tsconfig.json');

  const rawTsconfig = fs.readFileSync(tsConfigPath, 'utf8');
  const tsconfig = JSON.parse(rawTsconfig);

  if (!tsconfig.compilerOptions) {
    tsconfig.compilerOptions = {};
  }

  if (tsconfig.compilerOptions.outDir == './api')
    return logFileAlreadyUpdated('tsconfig.json');

  tsconfig.compWilerOptions.outDir = './api';

  fs.writeFileSync(tsConfigPath, JSON.stringify(tsconfig, null, 2), 'utf8');
  logFileUpdated('tsconfig.json');
}

updateTsConfig();
