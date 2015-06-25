var passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    mongoose = require("mongoose"),
    User = mongoose.model("User");

module.exports = function(passport){
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done){
        User.findOne({_id:id}, function(err, user){
            done(err, user);
        });
    });
    passport.use(new LocalStrategy(
    function(username, password, done){
        User.isValidUserPassword(username, password, done);
    }));
};
