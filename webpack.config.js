const path = require('path');

module.exports = {
  entry: './src/main.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'api'),
    filename: 'main.js',
  },
};
