const JWT           = require('jsonwebtoken');
const User          = require('../z1Models/user');
const { JWT_SECRET} = require('../z1Configurations');

signToken = (user) => {
    return token = JWT.sign({
        iss: 'VIPODAZA',
        sub: user.id,
        iat: new Date().getTime(), // Current Time
        exp: new Date().setDate(new Date().getDate() + 1) // Current Time Plus 1 Day
    }, JWT_SECRET );
}

module.exports = {
    signUp: async (req, res, next) => {
        const { email, password } = req.value.body;
        // Check If Email Already Exist
        //Check If Username Already Exists
        const foundUser = await User.findOne({ "local.email": email });
        if(foundUser) {
            return res.status(403).json({error: 'Email Is Already In Use'});
        }

        // Create A New User
        const newUser = new User({
            method:'local',
            local : {
                email: email,
                password: password 
            },
        });
        await newUser.save();

        // Generate Token
        const token = signToken(newUser);

         // Respond With Token
         res.status(200).json(token);


        // const email = req.value.body.email;
        // const password = req.value.body.password;
    },
    signIn: async (req, res, next) => {
        //Generate Token
        const token = signToken(req.user);
        res.status(200).json({ token });
     },

    googleOAuth: async (req, res, next) => {
        // Generate Token
        console.log('req.user', req.user);
        const token = signToken(req.user);
        res.status(200).json({ token });
    },
     secret: async (req, res, next) => {
        console.log('I managed to get here!');
        res.json({secret: 'Resources'});

     },
}