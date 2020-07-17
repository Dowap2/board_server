/*const express = require('express');
const app = express();

app.set('view engine','ejs'); // 1
app.use(express.static(__dirname + '/public'));

app.get('/hello', function(req,res){ // 2
  res.render('hello', {name:req.query.nameQuery});
});

app.get('/hello/:nameParam', function(req,res){ // 3
  res.render('hello', {name:req.params.nameParam});
});

const port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});*/
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); // 1
var app = express();

// DB setting
mongoose.set('useNewUrlParser', true);    // 1
mongoose.set('useFindAndModify', false);  // 1
mongoose.set('useCreateIndex', true);     // 1
mongoose.set('useUnifiedTopology', true); // 1
mongoose.connect('mongodb://localhost/board', {useNewUrlParser: true}); // 2
var db = mongoose.connection; //3
//4
db.once('open', function(){
  console.log('DB connected');
});
//5
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json()); // 2
app.use(bodyParser.urlencoded({extended:true})); // 3

var contactSchema = mongoose.Schema({
    name:{type:String, required:true, unique:true},
    email:{type:String},
    phone:{type:String}
  });
  var Contact = mongoose.model('contact', contactSchema); // 5
  
  // Routes
  // Home // 6
  app.get('/', function(req, res){
    res.redirect('/contacts');
  });
  // Contacts - Index // 7
  app.get('/contacts', function(req, res){
    Contact.find({}, function(err, contacts){
      if(err) return res.json(err);
      res.render('contacts/index', {contacts:contacts});
    });
  });
  // Contacts - New // 8
  app.get('/contacts/new', function(req, res){
    res.render('contacts/new');
  });
  // Contacts - create // 9
  app.post('/contacts', function(req, res){
    Contact.create(req.body, function(err, contact){
      if(err) return res.json(err);
      res.redirect('/contacts');
    });
  });

// Port setting
var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});