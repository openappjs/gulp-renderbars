var gutil = require('gulp-util')
var through = require('through2');
var Handlebars = require('handlebars');
var Path = require('path');
var debug = require('debug')('gulp-renderbars');

var hasExt = require('./lib/has-ext');

module.exports = function gulpRenderbars (options) {
  debug("setup", options);

  var data = options.data || {};
  var templateExt = options.templateExt || ".hbs";
  var partialExt = options.partialExt || (".partial" + templateExt);

  var isTemplate = hasExt(templateExt);
  var isPartial = hasExt(partialExt);

  var templates = {};

  return through.obj(function transform (file, enc, cb) {
    debug("transform", file, enc);
    
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(
        'gulp-renderbars',
        "Streaming not supported"
      ));
      return cb();
    }

    // convert contents from buffer to string
    var contents = file.contents.toString();
    var dirname = Path.dirname(Path.relative(file.base, file.path));

    try {
      if (isTemplate(file.path)) {
        debug("template", file.path, contents);
        // add compiled template to be rendered
        templates[file.path] = {
          template: Handlebars.compile(contents),
          base: file.base,
          cwd: file.cwd,
        };

      } else if (isPartial(file.path)) {
        // register partial with handlebars
        var basename = Path.basename(file.path, partialExt);
        var name = Path.join(dirname, basename);
        debug("partial", name, contents);

        Handlebars.registerPartial(name, contents);
      }

    } catch (err) {
      this.emit('error', new gutil.PluginError(
        'gulp-renderbars',
        err
      ));
    }

    cb();

  }, function flush (cb) {
    debug("flushing!");

    // render compiled templates
    Object.keys(templates).forEach(function (path) {
      var obj = templates[path];

      // render the template to a string
      var contents = obj.template(data);

      // create vinyl file object
      var file = new gutil.File({
        base: obj.base,
        cwd: obj.cwd,
        path: gutil.replaceExtension(path, ".html"),
        contents: new Buffer(contents),
      });
      // push file object to stream
      this.push(file);
    }.bind(this));

    cb();
  });
};
