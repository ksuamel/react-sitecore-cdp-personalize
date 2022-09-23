const { cpSync } = require('fs');
var package = require('./dist');
var cdpPersonalize = package.cdpPersonalize;

cdpPersonalize.initialize(
  'key',
  'targetApi',
  'cookieDomain',
  'pos',
  'flowTarget'
);

cdpPersonalize.getBrowserId();
