var User = require('../models/user.js');

module.exports = function(app, passport) {
    app.get('/admin', function(req, res) {
        if (req.isAuthenticated())
            User.find({}, function(err, doc){
                if(err) throw err;
                res.render('admin',{
                    user: req.user,
                    accounts: doc
                });
            });
        else
            res.render('home', {
                user: null
            })
    });

    app.post('/deleteuser', function(req, res, next) {
        User.remove(req.body.username, function(err) {
            if (err) throw err;
        });
        next();
    }, function(req, res) {
        console.log('We had to delete a user :(');
        User.find({}, function(err, doc){
            if(err) throw err;
            res.render('admin',{
                user: req.user,
                accounts: doc
            });
        });
    });
};
