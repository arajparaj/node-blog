// Module dependencies.
var express = require('express');
var ArticleProvider = require('./article-provider.js').ArticleProvider;
var bodyParser = require('body-parser')
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');


var app = module.exports = express();

// Configuration
app.set('views', __dirname + '/views');
app.set('view engine','jade');
app.use(bodyParser.json());                          // parse application/json
app.use(bodyParser.urlencoded({ extended: true }));  // parse application/x-www-form-urlencoded
app.use(methodOverride());
app.use(require('stylus').middleware({ src: __dirname + '/public' }));
app.use(express.static(__dirname + '/public'));


if ('development' == app.get('env')) {
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}

if ('production' == app.get('env')) {
  app.use(errorHandler());
}

var articleProvider= new ArticleProvider();


// Routes
app.get('/', function(req,res){
  articleProvider.findAll(function(error, docs){
    res.render('index',{ title: 'Blog', articles: docs });
    console.log(docs);
  })
});

app.listen(3000);