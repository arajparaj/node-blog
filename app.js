// Module dependencies.
var express = require('express');
var ArticleProvider = require('./article-provider-mongodb.js').ArticleProvider;
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

var articleProvider= new ArticleProvider('localhost',27017);


// Routes
app.get('/', function(req,res){
  articleProvider.findAll(function(error, docs){
    res.render('index',{ title: 'Blog', articles: docs });
  })
});

app.get('/blog/new', function(req, res) {
    res.render('new',{ title: 'New Post'});
});

app.post('/blog/new', function(req, res){
    articleProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/')
    });
});

app.get('/blog/:id', function(req, res) {
    articleProvider.findById(req.params.id, function(error, article) {
        res.render('show',
        {
            title: article.title,
            article:article
        });
    });
});

app.post('/blog/addComment', function(req, res) {
    articleProvider.addCommentToArticle(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
       } , function( error, docs) {
           res.redirect('/blog/' + req.param('_id'))
       });
});

app.listen(3000);
console.log("Express server started");