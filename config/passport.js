var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var AuthUser = require('../models/authSchema');
var User = require('../models/user');
var config             = require('../config/database')

module.exports = function(passport){
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(function(id, done){
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        nameField: 'name',
        usernameField: 'username',
        emailField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, username, password, done){
        process.nextTick(function(){
            User.findOne({'local.username': username}, function(err, user){
                if(err){
                    return done(err);
                } else {
                    if(user) {
                        return done(null, false, req.flash('signupMessage', 'That Email Is Already Taken'));
                    } else {
                
                        var newUser = new User({
                            method:'local',
                            local: {
                                name: req.body.name,
                                username: req.body.username,
                                email: req.body.email,
                                password: req.body.password
                            }
                        });

                        User.create(newUser, req.body.password, function (err, user) {
                            if (err) {
                                console.log(err);
                                return done(null, false);
                            }
                        });
                                                    
                        newUser.save(function(err){
                            if(err) {
                                throw err;
                            } else {
                                return done(null, newUser);
                                
                            }
                        });
                    }
                }
            })

        });
     }
    ));

    passport.use('facebook', new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL
      },
      function(accessToken, refreshToken, profile, done) {
        process.nextTick(function(){
            AuthUser.findOne({'facebook.id': profile.id}, function(err, user){
                if(err)
                    return done(err);
                if(user)
                    return done(null, user);
                else {
                    var newUser = new AuthUser({
                        method:'facebook',
                        facebook: {
                            id: profile.id,
                            email: profile.name.givenName + ' ' +profile.name.familyName,
                            name:  profile.emails[0].value,
                        }
                    });
                    // newUser.facebook.id = profile.id;
                    // newUser.facebook.token = accessToken;
                    // newUser.facebook.name = profile.name.givenName + ' ' +profile.name.familyName;
                    // newUser.facebook.email = profile.emails[0].value;

                    newUser.save(function(err){
                        if(err)
                            throw err;
                        return done(null, newUser);
                    })
                }    
            });
        });
     }
));

passport.use('google', new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
        AuthUser.findOne({'google.id': profile.id}, function(err, user){
            if(err)
                return done(err);
            if(user)
                return done(null, user);
            else {
                var newUser = new AuthUser({
                    method:'google',
                    google: {
                        id: profile.id,
                        email: profile.emails[0].value,
                        name: profile.displayName
                    }
                });
                // newUser.google.id = profile.id;
                // newUser.google.token = accessToken;
                // newUser.google.name = profile.displayName;
                // newUser.google.email = profile.emails[0].value;

                newUser.save(function(err){
                    if(err)
                        throw err;
                    return done(null, newUser);
                })
            }    
        });
    });
 }
));

    }; 