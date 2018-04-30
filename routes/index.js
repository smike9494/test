var express        = require('express');
var router         = express.Router();
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var User           = require('../models/user');
var MainArticle    = require('../models/article');
var configPass     = require('../config/passport');
var middleware     = require('../middleware');
var nodemailer     = require('nodemailer');
var async          = require('async');
var crypto         = require('crypto');
var multer         = require('multer');

var fileFilter     = (req, file, cb) => {
  //reject file
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null,true);
  } else {
  cb(null, false);
  }
};
var storage        = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  }
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 
  },
  fileFilter: fileFilter
});



//==================REGISTER/LOGIN==============================
//Show Register Form
router.get('/register',middleware.isNotAuthenticated, function (req, res) {
  res.render('register' );
});

router.post('/register', upload.single('profilePhoto'), function (req, res) {

  console.log(req.file);
  // Check Inputs
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('email', 'E-mail is required').notEmpty();
  req.checkBody('email', 'E-mail is invalid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if(errors) {
    console.log(errors);
    req.flash('error', errors[0].msg)
    res.redirect('register');
  } else {
     // Identify Errors

     console.log(req.file)

     var newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      // profilePhoto: req.file.path
      // password: req.body.password
  });
  
      User.register(newUser, req.body.password, function (err, user) {
        if (err) {
          console.log(err);
          // res.json(err);
          req.flash('error', 'Error')
          return res.render('register');
        }
        passport.authenticate('local')(req, res, function () {
          req.flash('success', 'Welcome to VIPODAZA' + " " + user.name);
          res.redirect('/');
        });
      });
  }
});
 

//LOGIN
router.get('/login', middleware.isNotAuthenticated, function (req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
      }), function (req, res) {
        
});

router.post('/login', function(req, res){

});

// FACEBOOK LOGIN ROUTES
router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
router.get('/auth/facebook/callback',passport.authenticate('facebook', { successRedirect: '/',failureRedirect: '/login' }));

//GOOGLE LOGIN ROUTES 
router.get('/auth/google', passport.authenticate('google', {scope: ['email','profile']}));
router.get('/auth/google/callback',passport.authenticate('google', { successRedirect: '/',failureRedirect: '/login' }));


//LOGOUT
router.get('/logout', middleware.isLoggedIn, function (req, res) {
    req.logout();
    // req.flash('success', 'Successfully Logged Out!')
    res.redirect('/');
  });

// forgot password
router.get('/reset', function(req, res) {
  res.render('reset');
});

router.post('/reset', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/reset');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'vipodaza@gmail.com',
          pass: 'letmein123yt'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'vipodaza@gmail.com',
        subject: 'VIPODAZA Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/reset');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/reset');
    }
    res.render('resetToken', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'vipodaza@gmail.com',
          pass: 'letmein123yt'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'vipodaza@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});
//Dashboard 
router.get('/dashboard-posts', middleware.isLoggedIn, function (req, res) {
  
      res.render('dashboardDashboard');

});  

router.get('/dashboard-wordpress', middleware.isLoggedIn, function (req, res) {

      res.render('dashboardDashboard');
      
    
});

router.get('/dashboard', middleware.isLoggedIn, function(req, res ){
  MainArticle.find({})
  .sort({date: -1})
  .exec(function(err, allArticles) {
    if (err || !allArticles) {
      console.log(err);
      res.render('articles/errorsPage')
    } else {
      res.render('postsDashboard', {mainArticles: allArticles});
    };
  });
});



// router.get('/dashboard-posts', middleware.isLoggedIn, function (req, res) {
//   MainArticle.find({}.sort({date: -1}), function (err, allArticles) {
//     if(err) {
//       console.log(err)
//       res.render('articles/errorsPage')
//     } else {
//       res.render('postsDashboard', {mainArticles: allArticles});
//     }
//   }); 



// });

router.get('/template', middleware.isLoggedIn, function (req, res) {

  res.render('template');

});

router.get('/appearance', middleware.isLoggedIn, function (req, res) {

  res.render('appearance');

});

router.get('/author/:slugName/:userRef', function(req, res){
  User.findOne({userRef: req.params.userRef}, function(err, foundAuthor){
    if(err) {
      console.log('failed to located author', err)
    } else {
      res.render('authorBio', {foundAuthor: foundAuthor});
     }
    });
    // MainArticle.find({author: req.params.userRef}, function(err, foundArticle){
    //   if(err) {
    //     console.log(err)
    //   } else {
    //     res.render('authorBio', {foundArticle:foundArticle});
    //   }
    // });  
  });
  

router.get('/*', function(req, res) {
  res.render('articles/errorPage')
});
module.exports = router;
