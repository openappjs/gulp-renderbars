var test = require('tape');
var streamArray = require('stream-array');
var gutil = require('gulp-util');
var render = require('../');

test('should render a template with data', function (t) {

  streamArray([
    new gutil.File({
      contents: new Buffer('<h1>{{test}}</h1>'),
      path: __dirname + '/some/path.hbs',
    }),
  ])
  .pipe(render({
    data: { test: "test data" },
  }))
  .on('data', function (file) {
    var result = file.contents.toString();
    t.equal(result, '<h1>test data</h1>', "correct render result");
  })
  .on('end', function () { t.end(); })
  ;
});

test('return error with stream', function (t) {
  streamArray([
    new gutil.File({
      contents: streamArray(['stream', 'with', 'those', 'contents']),
      path: __dirname + '/some/path.hbs',
    }),
  ])
  .pipe(
    render({
      data: { test: "test data" },
    })
  )
  .on('error', function (err) {
    t.equal(err.message, "Streaming not supported", "correct error message");
    t.end();
  })
  ;
});
