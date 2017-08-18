'use strict';
var stylus = require('stylus');
var utils  = stylus.utils;
var nodes  = stylus.nodes;
var StringScanner = require('StringScanner');

function numberCode(cc) {
  return '\\00' + cc.toString(16);
}

function char2numberCode(datum) {
  return numberCode(datum.charCodeAt(0));
}

function charEntity2numCode(datum) {
  var maps = require('./map.json');
  if (datum in maps) {
    return numberEntity2numCode(maps[datum]);
  }
  return datum.split('')
              .map(function(c) {
                return char2numberCode(c);
              })
              .join('');
}

function numberEntity2numCode(datum) {
  return numberCode(datum.replace(/(?:^&#|;$)/g, ''));
}

function numcode(text) {
  utils.assertString(text, 'text');
  var ss = new StringScanner(text.string);
  var token = [];
  while (!ss.eos()) {
    if (ss.scan(/(&\w+?;)/)) {
      token.push(charEntity2numCode(ss.captures()[0]));
      continue;
    }
    if (ss.scan(/(&#\d+?;)/)) {
      token.push(numberEntity2numCode(ss.captures()[0]));
      continue;
    }
    token.push(char2numberCode(ss.getch()));
  }
  token = new nodes.String(token.join(''));
  return token;
}

module.exports = numcode;
