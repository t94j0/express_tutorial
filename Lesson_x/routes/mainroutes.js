var User = require('../models/user.js'),
    Auth = require('../util/authorization.js');

module.exports = function(app, passport) {
    app.get('/profile', Auth.isAuthenticated, function(req, res) {
        res.render("profile", {
            user: req.user
        });
    });

    app.get('/fundsadded', function(req, res){
        if(req.isAuthenticated())
            res.render('fundsadded', {user:req.user});
        else
            res.render('fundsadded', {user:null});

    });
};
