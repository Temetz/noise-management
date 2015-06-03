
var express         = require('express');
var path            = require("path");
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');

// Constants
var PORT = 8002;

// App
var app = express();

app.use(bodyParser.json());
app.use(cookieParser('verysecurepassword'));
app.use('/static', express.static(__dirname + '/public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');


app.get('/', function (req, res) {
    res.redirect('/gui/welcome');
});

app.get('/gui/welcome', function (req, res) {
    res.render('welcome');
});

app.get('/gui/configure', function (req, res) {
    res.render('configure');
});

app.get('/gui/target', function (req, res) {
    res.render('target');
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
