const path = require('path');

module.exports = {
  devtool: 'source-map', 
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, ''),
    filename: 'index.js'
  }
}