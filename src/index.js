'use strict';
var StringScanner = require('StringScanner');

function numberCode(cc) {
  return "\\00" + cc.toString(16);
}

function char2numberCode(datum) {
  return numberCode(datum.charCodeAt(0));
}

function charEntity2numberCode(datum) {
  var maps = require('./map.json');
  if (datum in maps) {
    return numberEntity2numCode(maps[datum]);
  } else {
    return datum.split('')
                .map(function(c) {
                  return char2numberCode(c);
                }).join('');
  }
}

function numberEntity2numCode(datum) {
  return numberCode(datum.replace(/(?:^&#|;$)/g, ''));
}

module.exports = function(text) {
  var stylus, utils, nodes, ss, token = [];
  stylus = require('stylus');
  utils  = stylus.utils;
  nodes  = stylus.nodes;
  utils.assertString(text, 'text');
  ss = new StringScanner(text.string);

  while (!ss.eos()) {
    if (ss.scan(/(&\w+?;)/)) {
      token.push(cent2nc(ss.captures()[0]));
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
};
