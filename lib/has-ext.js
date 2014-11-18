var Path = require('path');

module.exports = hasExt;

function hasExt(ext) {
  var extEscaped = ext.replace(/\./g, '\\.');
  var extRegex = new RegExp("^[^/\.]+" + extEscaped + "$");
  return function (path) {
    var basename = Path.basename(path);
    return extRegex.test(basename);
  };
}
