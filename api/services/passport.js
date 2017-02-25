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
            .populate('account')

            .populate('matchedToPay')
            .populate('matchedToBePaidBy')
            .then(function(user){
                console.log('user ', user);
                if(!user){
                    return done(null, false, {message:'Wrong Username/Password Combination'});
                } else{
                    bcrypt.compare(password, user.password, function(err, results){
                        if(!results){
                            return done(null, false, {message:'Wrong Username/Password Combination'});
                        } else{

                            if(user.account) {
                                Account
                                    .findOne({id:user.account.id})
                                    .populate('bank')
                                    .then(aData => {
                                        user.account = aData;
                                        console.log('aData Banks: ', aData);
                                        Package.findOne({id:user.userpackage}).then(bData => {
                                            user.userpackage    = bData;
                                            console.log('aData package: ', bData);
                                            return done(null, user);
                                        })
                                        .catch(bError => {
                                            console.log('passport error 2: ', bError);
                                            return done(bError);
                                        });

                                    })
                                    .catch(aError => {
                                        console.log('passport Error: ', aError);
                                        return done(aError);
                                    });
                            } else return done(null, user);
                        }
                    });
                }
            })
            .catch(function(e){
                return done(e);
            });
    }
));
