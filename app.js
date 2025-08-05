/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');
var cors = require('cors');
// const mongoose = require("mongoose");
// mongoose.set("debug", true);

/**Routes file  */
var indexRouter = require('./routes/index');
var users = require('./routes/users');
var adminRouter = require('./routes/admin');

const { Error_Logs } = require('./app/errorLogs/model/logModal');
const handleResponse = require('./middleware/handleResponse');
const _tokenManager = require('./middleware/auth');
const { rateLimitChecker } = require('./middleware/rateLimitChecker');

// const seed = require("./helpers/seed");

var app = express();
/**
 * Middlewares
 */
app.use(
  cors({
    origin: '*',
  })
);
// view engine setup
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

require('./helpers/logger');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/public', express.static(path.join(__dirname, '/public/')));
app.use('/api/uploads/', express.static(path.join(__dirname, '../uploads/')));
app.use(
  '/api/backupDump/',
  express.static(path.join(__dirname, '/backupDump/'))
);
app.use('/api/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/api', indexRouter);
app.use(
  '/api/users',
  _tokenManager.authenticate,
  users,
  handleResponse.RESPONSE
);
app.use(
  '/api/admin',
  _tokenManager.admin,
  adminRouter,
  handleResponse.RESPONSE
);

require('./config/db/dbConfig');
require('./helpers/schedule');
app.use(rateLimitChecker(400, 60, 60));

// seed();
//
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(async function (err, req, res, next) {
  // set locals, only providing error in development
  const ipAddress =
    req.header('x-forwarded-for') || req.socket.remoteAddress.split(':')[3];

  const errorLogs = {
    apiEndpoint: req.originalUrl,
    methodUsed: req.method,
    ip: ipAddress,
    headers: req.headers,
    body: req.body,
    response: req.newRespData,
  };

  const payload = {
    errorCode: err ? err.statusCode || 500 : 500,
    errorName: req?.newRespData?.message
      ? req?.newRespData?.message
      : err?.message,
    description: err?.stack,
    ip: ipAddress,
    apiEndpoint: req.originalUrl,
    methodUsed: req.method,
    userAgent: req.headers['user-agent'],
  };

  // Create a new object that combines both errorLogs and payload
  const errorData = { ...errorLogs, ...payload };

  // Save errorData to Error_Logs model
  await Error_Logs.create(errorData);

  // if (err.statusCode === 404) {
  //   // Check if the API endpoint is valid
  //   if (!isValidApiEndpoint(req.originalUrl)) {
  //     return res.status(404).send({ message: "Invalid API endpoint" });
  //   } else {
  //     return res.status(404).send({ message: "Api Not Found !" });
  //   }
  // } else {
  //   return res.status(err.statusCode || 500).send({ message: err.message });
  // }
});

module.exports = app;
