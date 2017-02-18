var passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    bcrypt          = require('bcrypt');

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use(new LocalStrategy({
        usernameField:'username',
        passwordFIeld:'password'
    },
    function(username, password, done){
        User.findOne({username:username})
            .then(function(user){
                if(!user){
                    return done(null, false, {message:'Wrong Username/Password Combination'});
                } else{
                    bcrypt.compare(password, user.password, function(err, results){
                        if(!results){
                            return done(null, false, {message:'Wrong Username/Password Combination'});
                        } else{
                            return done(null, user);
                        }
                    });
                }
            })
            .catch(function(e){
                return done(e);
            });
    }
));
