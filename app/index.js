var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const config = require('./config');

var app = express();

app.set('systemConf', config);

// Session-Managment
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

require('./authentication').init(app);

app.use(session({
    store: new RedisStore({
        url: config.redisStore.url
    }),
    secret: config.redisStore.secret,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// view engine and views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var routes = require('./views/index');
var login = require('./api/login');

app.use('/', routes);
app.use('/login', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

