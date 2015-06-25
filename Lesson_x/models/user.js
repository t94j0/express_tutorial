var mongoose = require('mongoose'),
    pwd = require('pwd');

UserSchema = mongoose.Schema({
    name:String,
    username:String,
    salt:String,
    hash:String,
});

UserSchema.statics.signup = function(name, username, password, done){
    var User = this;
    pwd.hash(password, function(err, salt, hash){
        if(err) throw err;
        User.create({
            username:username,
            name:name,
            salt:salt,
            hash:hash,
        }, function(err, user){
            if(err) return console.log(err);
            done(null, user);
        });
    });
};

UserSchema.statics.resetPassword = function(username, oldPassword, newPassword, done){
    var User = this;
    //Finds the specified user and checks to see if the oldPassword is the same
    User.findOne({username:username}, function(err, user){
        if(err) throw err;
        if(err) return done(err);
        if(!user) return done(null, false, { message : 'Incorrect username.' });
        //The checking of the old password
        pwd.hash(oldPassword, user.salt, function(err, hash){ 
            if(err) return done(err);
            if(hash != user.hash) {
                done(null, false, {
                    message : 'Incorrect password'
                });
            } else {
                //If all of that is correct, then it will change it to the new password
                pwd.hash(newPassword, function(err, salt, hash){ 
                    if(err) throw err;
                    User.update({username:username}, {
                        $set:{
                            salt:salt,
                            hash:hash
                        }
                    }, function(err){
                        if(err) throw err;
                        done(null);
                    });
                });
            }
        });
    })
};

UserSchema.statics.remove = function(username, done){
    var User = this;
    User.findOneAndRemove({username:username}, function(err){
        if(err) throw err;
        done(err);
    });
    done(null);
};

UserSchema.statics.isValidUserPassword = function(username, password, done) {
    var User = this;
    //Self-explanitory, but it uses the pwd function to validate the hash of the user
    User.findOne({username : username}, function(err, user){
        if(err) return done(err);
        if(!user) return done(null, false, { message : 'Incorrect username.' });
        pwd.hash(password, user.salt, function(err, hash){
            if(err) return done(err);
            if(hash == user.hash) return done(null, user);
            done(null, false, {
                message : 'Incorrect password'
            });
        });
    });
};

var User = mongoose.model("User", UserSchema);
module.exports = User;
