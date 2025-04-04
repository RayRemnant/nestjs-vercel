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

async function updateTsConfigBuild() {
  const tsconfigBuildPath = path.join(process.cwd(), 'tsconfig.build.json');

  // if file does not exist, skip (user might not be using ts)
  if (!fs.existsSync(tsconfigBuildPath))
    return logFileNotFound('.tsconfig.build.json');

  const rawTsconfigBuild = fs.readFileSync(tsconfigBuildPath, 'utf8');
  const tsconfigBuild = JSON.parse(rawTsconfigBuild);

  if (!tsconfigBuild.exclude) {
    tsconfigBuild.exclude = [];
  }

  if (tsconfigBuild.exclude.includes('api'))
    return logFileAlreadyUpdated('tsconfig.build.json');

  tsconfigBuild.exclude.push('api');

  fs.writeFileSync(
    tsconfigBuildPath,
    JSON.stringify(tsconfigBuild, null, 2),
    'utf8',
  );
  logFileUpdated('tsconfig.build.json');
}

updateTsConfigBuild();

async function updatePackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');

  if (!fs.existsSync(packageJsonPath)) return logFileNotFound('package.json');

  const rawPackageJson = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(rawPackageJson);

  if (!packageJson.scripts || !packageJson.scripts.build) return;

  if (packageJson.scripts.build.includes('--builder=webpack'))
    return logFileAlreadyUpdated('package.json');

  packageJson.scripts.build += ' --builder=webpack';
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    'utf8',
  );
  logFileUpdated('package.json');
}

updatePackageJson();
