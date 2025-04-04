const fs = require('fs');
const path = require('path');

const colorize = (...args) => ({
  black: `\x1b[30m${args.join(' ')}\x1b[0m`,
  red: `\x1b[31m${args.join(' ')}\x1b[0m`,
  green: `\x1b[32m${args.join(' ')}\x1b[0m`,
  yellow: `\x1b[33m${args.join(' ')}\x1b[0m`,
  blue: `\x1b[34m${args.join(' ')}\x1b[0m`,
  magenta: `\x1b[35m${args.join(' ')}\x1b[0m`,
  cyan: `\x1b[36m${args.join(' ')}\x1b[0m`,
  white: `\x1b[37m${args.join(' ')}\x1b[0m`,
});

const logFileNotFound = (fileName) =>
  console.log(colorize(`❔ NOT FOUND ${fileName}`).yellow);

const logFileAlreadyUpdated = (fileName) =>
  console.log(colorize(`ℹ️  OK ${fileName}`).blue);

const logFileUpdated = (fileName) =>
  console.log(colorize(`🔄 UPDATE OK ${fileName}`).green);

const logFileCreated = (fileName) =>
  console.log(colorize(`✅ CREATED OK ${fileName}`).green);

const logParseFailed = (fileName, errorMessage) =>
  console.log(colorize(`❌ PARSE FAIL ${fileName}\n${errorMessage}`).red);

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

async function updateWebpackConfig() {
  const webpackConfigPath = path.join(process.cwd(), 'webpack.config.js');

  const defaultConfig = {
    entry: './src/main.ts',
    target: 'node',
    output: {
      path: path.resolve(__dirname, 'api'),
      filename: 'main.js',
    },
  };

  // if file does not exist, create it with default configuration
  if (!fs.existsSync(webpackConfigPath)) {
    const defaultWebpackConfig = `const path = require('path');

module.exports = {
	${JSON.stringify(defaultConfig, null, 2)}
}
`;
    fs.writeFileSync(webpackConfigPath, defaultWebpackConfig, 'utf8');
    return logFileUpdated('webpack.config.js');
  }

  const webpackConfig = require('./webpack.config.js');

  let update = false;

  Object.keys(defaultConfig).forEach((key) => {
    if (
      JSON.stringify(webpackConfig[key]) !== JSON.stringify(defaultConfig[key])
    ) {
      webpackConfig[key] = defaultConfig[key];
      update = true;
    }
  });

  if (!update) return logFileAlreadyUpdated('webpack.config.js');

  fs.writeFileSync(webpackConfigPath, webpackConfig, 'utf8');
  logFileCreated('webpack.config.js');
}

updateWebpackConfig();

async function updateVercelJson() {
  const vercelPath = path.join(process.cwd(), 'vercel.json');

  // if file does not exist, create it with default configuration
  if (!fs.existsSync(vercelPath)) {
    const newVercelConfig = {
      version: 2,
      rewrites: [
        {
          source: '/(.*)',
          destination: '/api/main.js',
        },
      ],
      outputDirectory: '',
    };

    fs.writeFileSync(
      vercelPath,
      JSON.stringify(newVercelConfig, null, 2),
      'utf8',
    );
    return logFileCreated('vercel.json');
  }

  const rawVercelConfig = fs.readFileSync(vercelPath, 'utf8');
  const vercelConfig = JSON.parse(rawVercelConfig);

  let update = false;

  if (
    !vercelConfig.rewrites ||
    !vercelConfig.rewrites.some(
      (rewrite) =>
        rewrite.source === '/(.*)' && rewrite.destination === '/api/main.js',
    )
  ) {
    if (!vercelConfig.rewrites) {
      vercelConfig.rewrites = [];
    }

    vercelConfig.rewrites.push({
      source: '/(.*)',
      destination: '/api/main.js',
    });

    update = true;
  }

  if (
    vercelConfig.outputDirectory === undefined ||
    vercelConfig.outputDirectory !== ''
  ) {
    vercelConfig.outputDirectory = '';
    update = true;
  }

  if (!update) return logFileAlreadyUpdated('vercel.json');

  fs.writeFileSync(vercelPath, JSON.stringify(vercelConfig, null, 2), 'utf8');
  logFileUpdated('vercel.json');
}

updateVercelJson();

async function updateVercelIgnore() {
  const vercelIgnorePath = path.join(process.cwd(), '.vercelignore');

  // if file does not exist, create it with default configuration
  if (!fs.existsSync(vercelIgnorePath)) {
    const vercelIgnoreContent = `# Ignore everything except the /api directory and package.json for dependencies
*
!/api
!/api/*
!package.json
`;
    fs.writeFileSync(vercelIgnorePath, vercelIgnoreContent, 'utf8');
    return logFileUpdated('.vercelignore');
  }

  let vercelIgnoreContent = fs.readFileSync(vercelIgnorePath, 'utf8');
  const vercelIgnoreLines = vercelIgnoreContent.split(/\r?\n/);

  let update = false;

  const requiredLines = ['!package.json', '!/api', '!/api/*', '*'];
  requiredLines
    .filter((line) => !vercelIgnoreLines.includes(line))
    .forEach((line) => {
      vercelIgnoreContent = `${line}\n${vercelIgnoreContent}`;
      update = true;
    });

  if (!update) return logFileAlreadyUpdated('.vercelignore');

  fs.writeFileSync(vercelIgnorePath, vercelIgnoreContent, 'utf8');
  return logFileUpdated('.vercelignore');
}

updateVercelIgnore();

async function gitIgnore() {
  const gitIgnorePath = path.join(process.cwd(), '.gitignore');

  if (!fs.existsSync(gitIgnorePath)) {
    fs.writeFileSync(gitIgnorePath, '.vercel', 'utf8');
    return logFileCreated('.gitignore');
  }

  let gitIgnoreContent = fs.readFileSync(gitIgnorePath, 'utf8');
  const gitignoreLines = gitIgnoreContent.split(/\r?\n/);

  if (gitignoreLines.includes('.vercel'))
    return logFileAlreadyUpdated('.gitignore');

  gitIgnoreContent = `.vercel\n\n${gitIgnoreContent}`;

  fs.writeFileSync(gitIgnorePath, gitIgnoreContent, 'utf8');
  logFileUpdated('.gitignore');
}

gitIgnore();
