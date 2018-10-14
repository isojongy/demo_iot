var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var awsIot = require('aws-iot-device-sdk');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
});

//awsIOT
var device = awsIot.device({
    keyPath: 'cert/private.pem.key',
    certPath: 'cert/certificate.pem.crt',
    caPath: 'cert/rootCA.pem',
    clientId: 'MyBus',
    region: "us-east-2",
    baseReconnectTimeMs: 4000,
    keepalive: 300,
    protocol: "mqtts",
    host: "a225bmxz9v2vxr.iot.us-east-2.amazonaws.com",
    debug: false
});

var contents = "Start ... !!!";

device.on('connect', function () {
   console.log('connect');
   // device.subscribe('MyBusPolicy');
   device.publish('MyBusPolicy', JSON.stringify({
       test_data: 'Nodejs ...',
   }));
   console.log('Message Sent ...');
});

module.exports = app;
