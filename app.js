var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors')

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/board', {useNewUrlParser: true});
var db = mongoose.connection;

db.once('open', function(){
  console.log('DB connected');
});
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

app.set('view engine', 'ejs');
app.use(cors())
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var boardSchema = mongoose.Schema({
    title:{type:String, required:true, unique:true},
    main:{type:String},
  });
  var Contact = mongoose.model('contacts', boardSchema);

  app.get('/', function(req, res){
    res.redirect('/contacts');
  });

  app.get('/contacts', function(req, res){
    Contact.find({}, function(err, contacts){
      if(err) return res.json(err);
      res.send({contact: contacts});
    });
  });

  app.get('/contacts/new', function(req, res){
    res.render('contacts/new');
  });

  app.post('/contacts', function(req, res){
    Contact.create(req.body, function(err, contact){
      if(err) return res.json(err);
      res.redirect('/contacts');
    });
  });

var port = 8000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});