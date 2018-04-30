const passport                = require('passport');
const {JWT_SECRET}            = require('./z1Configurations');
const User                    = require('./z1Models/user');    
const LocalStrategy           = require('passport-local').Strategy;

// JSON WEB TOKEN STRATEGY
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try{
    // Find The User Specified In Token
    const user = await User.findById(payload.sub);

    // If User Doesn't Exit, Handle It
    if(!user) {
        return done(null, false);
    }
    // Otherwise, return user
    done(null, user);

    } catch(error) {
        done(error, false);
    }
}));

// LOCAL STRATEGY 
passport.use(new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done) => {
    try {
        // Find The User Given The Email
        const user = await User.findOne({"local.email": email });
        // If Not, Handle It
        if (!user) {
            return done(null, false);
        }
        // Check If The Password Is Correct
        const isMatch = await user.isValidPassword(password);

        // If Not, Handle It
        if(!isMatch){
            return done(null, false);
        }
        // Otherwise Return The User
        done(null, user);
        } catch(error) {
        done(error,false);
    }
}));

// GOOGLE STRATEGY

passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: '518258226793-eq2i5ss0h9g8q45fd2pj3tqlk144thjk.apps.googleusercontent.com',
    clientSecret: 'BjugOWYPTEpYARK9owhMZtj_'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Access Token', accessToken);
        console.log('Refresh Token', refreshToken);
        console.log('profile Token', profile);
    
        // Check Whether Current User Exists In DB
        const existingUser = await User.findOne({"google.id": profile.id })
        if(existingUser) {
            console.log('User Already Exists In DB');
            return done(null, existingUser);
        }
        console.log('User Doesnt Exists In DB');
        // If New Account
        const newUser = new User({
            method: 'google',
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });
        await newUser.save();
        done(null, newUser);
    } catch(error) {
        done(errors, false, error.message);
    }
}));