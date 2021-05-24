'use strict';

const { join } = require('path');
const fs = require('fs');

const hasPackageJson = (cwd, handleIt) => {
  if (!fs.existsSync(join(cwd, 'package.json'))) {
    if (handleIt) {
      console.error('This is not a Node.js project (no package.json found).');
      process.exit(1);
    } else {
      return false;
    }
  }
  return true;
};

const hasAnyDependencies = (cwd, handleIt) => {
  let errors = 0;
  if (!require(`${cwd}/package.json`).dependencies) {
    errors++;
  }
  if (!require(`${cwd}/package.json`).devDependencies) {
    errors++;
  }
  if (errors === 2) {
    if (handleIt) {
      console.error('The project has no dependencies declared.');
      process.exit(1);
    } else {
      return false;
    }
  }
  return true;
};

const hasDevDependencies = (cwd, handleIt) => {
  if (!require(`${cwd}/package.json`).devDependencies) {
    if (handleIt) {
      console.error('The project has no dev dependencies declared.');
      process.exit(1);
    } else {
      return false;
    }
  }
  return true;
};

const hasDependencies = (cwd, handleIt) => {
  if (!require(`${cwd}/package.json`).dependencies) {
    if (handleIt) {
      console.error('The project has no dependencies declared.');
      process.exit(1);
    } else {
      return false;
    }
  }
  return true;
};

const hasNodeModules = (cwd, handleIt) => {
  const modulesDir = join(cwd, 'node_modules');
  if (fs.existsSync(modulesDir)) {
    const content = fs.readdirSync(modulesDir).filter(e => e !== '.bin');
    if (content.length === 0) {
      if (handleIt) {
        console.error('No module installed. Please run npm install.');
        process.exit(1);
      } else {
        return false;
      }
    }
  } else {
    if (handleIt) {
      console.error('Directory node_modules not found. Please run npm install.');
      process.exit(1);
    } else {
      return false;
    }
  }
  return true;
};

module.exports = {
  hasPackageJson,
  hasNodeModules,
  hasDependencies,
  hasDevDependencies,
  hasAnyDependencies
};
