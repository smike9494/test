// const express                   = require('express');
// const router                    = require('express-promise-router')();
// const { validateBody, schemas } = require('../z1Helpers/routeHelpers');
// const UsersController           = require('../z2Controllers/users');
// const passport                  = require('passport');
// const passportCongif            = require('../passport');

// router.route('/register')
//     .post(validateBody(schemas.authSchema), UsersController.signUp);

// router.route('/login')
//     .post(validateBody(schemas.authSchema), passport.authenticate('local', {session: false}), UsersController.signIn);

// router.route('/secret')
//     .get(passport.authenticate('jwt', { session: false }), UsersController.secret);

// router.route('/oauth/google')
//     .post(passport.authenticate('googleToken', {session: false }), UsersController.googleOAuth);
   
// module.exports = router;