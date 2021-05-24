'use strict';

// lists all .js files in a project.

const { extname } = require('path');
const readdir = require('recursive-readdir');

const exclude = (file, stats) => {
  return (file.includes('node_modules') ||
          file.includes('.git') ||
          file.includes('dist') ||
          file.includes('docs') ||
          file.includes('license') ||
          file.includes('LICENSE') ||
          file.includes('readme') ||
          file.includes('README') ||
          file.includes('coverage')) ||
          (extname(file) !== '' && extname(file) !== '.js');
};

module.exports = (path, ignore) => {
  if (ignore && ignore.length > 0) {
    return readdir(path, [exclude].concat(ignore));
  }
  return readdir(path, [exclude]);
};