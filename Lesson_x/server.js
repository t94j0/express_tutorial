var express = require('express'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    database = require("./controllers/database.js"),
    port = 2222,
    app = express();

//For database configs, check controllers/database.js
mongoose.connect(database.db);
var Users = require('./models/user.js'),
passportConf = require('./controllers/passport.js')(passport);

app.set('view engine', 'jade');

app.use(express.static('public'));

//Middleware
//Setting up cookies
app.use(cookieParser());

//Set up body POST parsing
app.use(bodyParser.urlencoded({extended:false}));

//Set up passport requirements
app.use(session({ 
    secret: 'NewSecretPhrase',
    resave:true,
    saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());


mainRoute = require('./routes/index.js')(app, passport);

app.listen(port, function(){
    console.log('Listening on port: ' + port);
});
