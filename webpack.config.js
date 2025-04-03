const path = require('path');

module.exports = {
    entry: './src/main.ts',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'api'), // Change output directory to /api
        filename: 'main.js',
    }
}