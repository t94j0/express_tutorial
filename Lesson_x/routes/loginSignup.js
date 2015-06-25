var User = require('../models/user.js'),
    //Authorization has the isAuthenticated and userExist functions in it.
    //They are not worth looking at, they do what it sounds like they do.
    Auth = require('../util/authorization.js');

module.exports = function(app, passport) {
    app.get("/login", function(req, res) {
        if(req.isAuthenticated()){
            res.render('home', {
                //This is the first use of message as a parameter, 
                message:'You are already logged in!',
                user: req.user
            });
        } else {
            res.render("login", {
                user:null
            });
        }
    });

    app.post("/resetpassword", function(req, res, next){
        //The reason that it is not safe is that anyone can make a post request here.
        //I guess the silver lining is that we use req.user.username
        //But, if they can fake that, they can brute force this 
        User.resetPassword(req.user.username, req.body.oldpassword, req.body.newpassword, function(err, bool, message){
            if(err) throw err;
            if(message)
                res.render('profile', {message:message, user:req.user});
            else
                next();
        });
    }, function(req, res){
        console.log('Reset a password for ' + req.user.username);
        res.render('profile', {user:req.user});
    });

    //This is passport stuff for login
    app.post("/login", passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/login",
    }));

    app.get("/signup", function(req, res) {
        if(req.isAuthenticated()){
            res.render("signup", { user:req.user });
        } else {
            res.render("signup", { user:null });
        }
    });

    //This is a kinda annoying, but I'll walk you through it
    app.post("/signup", Auth.userExist, function(req, res, next) {
        console.log('Created a new user!');
        //Now, sign that person up
        User.signup(req.body.name, req.body.username, req.body.password, function(err, user) {
            if (err) throw err;
            next();
        });
    }, function(req, res) {
        res.render('showmessage', { theMessage: "Created account!" });
    });
    
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

}
