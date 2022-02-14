var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var nocache = require('nocache');

var session = require('express-session');
var homeRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var thanksRouter = require('./routes/thanks');
var designRouter = require('./routes/design'); 
var codeRouter = require('./routes/code');
var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//theejs

app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')));

app.use(nocache());
app.use(session({secret: 'oblong'}));

app.use('/', homeRouter);
app.use('/home', homeRouter);
app.use('/users', usersRouter);
app.use('/thanks', thanksRouter);
app.use('/design', designRouter);
app.use('/code', codeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  console.log(err);
});

module.exports = app;