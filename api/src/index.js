var express         = require('express');
var shell           = require('shelljs');
var path            = require("path");
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');

// Constants
var PORT = 5300;

// App
var app = express();

// Authentication
app.locals.state = {
    authenticated: false
}

app.use(bodyParser.json());
app.use(cookieParser('verysecurepassword'));
app.use('/static', express.static(__dirname + '/public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.all('*', checkUser);

function checkUser(req, res, next) {
  var _ = require('underscore')
      , nonSecurePaths = ['/', '/gui/login', '/login'];

  if ( _.contains(nonSecurePaths, req.path) ){
    if(app.locals.state.authenticated === true){
        app.locals.state.authenticated = false;
        return next();
    }
    return next();
  }

  if(req.cookies.apikey == process.env.APIKEY){
        app.locals.state.authenticated = true;
        next();
    }
    else {
        app.locals.state.authenticated = false;
        res.redirect('/gui/login');
    }
}

app.put('/limit', function (req, res) {
    var command = 'sudo tc qdisc change dev lo root netem ';
    command += 'loss ' + req.body.loss + '% ';
    command += 'delay ' + req.body.delay + 'ms ';
    command += req.body.delayvariance + 'ms ';
    if(req.body.jitter === 1){
        command += 'distribution ' + req.body.distribution;

    }
    shell.exec(command, {silent:true});
    var status = shell.exec('sudo tc qdisc show', {silent:true}).output;
    res.json(status);
});

app.put('/target', function (req, res) {
    var command = "sudo sed -i '33s/.*/server target " + req.body.httptarget + "/' /etc/haproxy/haproxy.cfg";
    shell.exec(command, {silent:true});
    var status = shell.exec('sudo service haproxy restart', {silent:true}).output;
    res.json(status);
});

app.post('/login', function (req, res) {
    if(req.body.apikey == process.env.APIKEY)
    {
        res.cookie('apikey', req.body.apikey);
        res.json("Login success");
        return;
    }
    res.clearCookie('apikey', '')
    res.status(401);
    res.json("Invalid login");
});

app.post('/logout', function (req, res) {
    res.clearCookie('apikey', '')
    res.json("You have logged out");
});

app.get('/', function (req, res) {
    res.redirect('/gui/welcome');
});

app.get('/gui/welcome', function (req, res) {
    res.render('welcome', {host:req.headers['host']});
});

app.get('/gui/configure', function (req, res) {
    res.render('configure');
});

app.get('/gui/target', function (req, res) {
    res.render('target');
});

app.get('/gui/logout', function (req, res) {
        res.render('logout');
});

app.get('/gui/login', function (req, res) {
        res.render('login');
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
