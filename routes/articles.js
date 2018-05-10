var express          = require('express');
var passport         = require('passport');
var http             = require('http'); // Require HTTP module
var LocalStrategy    = require('passport-local');
var router           = express.Router();
var moment           = require('moment');
var MainArticle      = require('../models/article');
var Comment          = require('../models/comment');
var User             = require('../models/user');
var middleware       = require('../middleware');
const fs             = require('fs');
const path           = require('path');
var multer         = require('multer');


// INDEX ROUTE
router.get('/search', function (req, res) {
  // var searchObj = req.query;
  if (req.query.search) {
    var regex = new RegExp(escapeRegex(req.query.search), 'gi');
    MainArticle.find({ title: regex } || { content: regex }, function (err, searchArticle) {
      if (err || !searchArticle) {
        console.log(err);
        req.flash('error', 'Could not locate page')
        redirect('back');
      } else {
        console.log(req.query);
        res.render('search', { mainArticles: searchArticle });
      }
    });
  } else {
    MainArticle.find({}, function (err, searchArticle) {
      if (err) {
        console.log(err);
      } else {
        console.log(req.query);
        res.render('search', { mainArticles: searchArticle });
      }
    });
  }
});

//NEW POST
router.get('/access/control/post/new', middleware.rbacPostPermissions, function (req, res) {
  res.render('articles/new');
});

//CREATE NEW POST
router.post('/article/:id', middleware.isLoggedIn,  function (req, res) {

    //GET DATA AND ADD TO FRONT PAGE
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var metaDescription = req.body.blog.metaDescription;
    var image            = req.body.blog.image;
    var title            = req.body.blog.title;
    var category         = req.body.blog.category;
    var content          = req.body.blog.content;
    var slug             = req.body.blog.slug; 
    var priority         = req.body.blog.priority;
    // var uid              = randomNumber;
    var author = {
        id: req.user._id,
        username: req.user.username,
        name: req.user.name,
        photo: req.user.profilePhoto,
        slugName: req.user.slugName,
        userRef: req.user.userRef
      };
    var newArticle = { metaDescription: metaDescription, slug: slug, image: image, title: title, category: category, content: content, author: author, priority: priority };
    MainArticle.create(newArticle, function (err, newlyCreated) {
        if (err || !newlyCreated) {
          console.log(err);
          req.flash('error', 'Could not create new article' + err)
          res.redirect('back');
        } else {
          //REDIRECT TO FRONT PAGE
          req.flash('success','Article successfully posted ');
          res.redirect('/');
        }
      });
  });

//EDIT ARTICLE

router.get('/article/:categorySlug/:slug/edit',  middleware.checkOwnership, function (req, res) {
    //Is user logged in?
    var slug = req.params.slug
    MainArticle.findOne({'slug' : slug}, function (err, foundMainArticle) {
      if (err) {
        console.log(err);
      }
      //Does article belong to user?
      res.render('articles/edit', { mainArticles: foundMainArticle });
    });
  });

//UPDATE ARTICLE
router.put('/article/:categorySlug/:slug', middleware.checkOwnership, function (req, res) {
    var imageDescription =req.body.blog.imageDescription;
    var image            = req.body.blog.image;
    var title            = req.body.blog.title;
    var category         = req.body.blog.category;
    var slug             = req.body.blog.slug;
    var content          = req.body.blog.content;
    var updated          = req.body.blog.updated;
    var priority         = req.body.blog.priority;
    var author = {
        id: req.user._id,
        username: req.user.username,
        name: req.user.name,
        photo: req.user.profilePhoto,
        slugName: req.user.slugName,
        userRef: req.user.userRef
      };
    var categorySlug   = req.body.blog.category; 
    var updatedContent = { imageDescription, updated, slug, image, title, category, content, author, priority };

    req.body.blog.body = req.sanitize(req.body.blog.body);
  
    var slug = req.params.slug
    var searchSlug = {'slug': slug};

    MainArticle.findOneAndUpdate(searchSlug, updatedContent, function (err, updatedArticle) {
        if (err || !updatedArticle) {
          req.flash('error','Article Update Failed!' + err)
          res.redirect('/');
        } else {
          req.flash('success', 'Article Successfully Updated!')
          res.redirect('/article/' + req.params.categorySlug + '/' + req.params.slug);
        }
      });
  });

// SHOW PAGE FOR ARTICLES
router.get('/article/:dateSlug/:categorySlug/:slug', middleware.foundArticle, function (req, res) {
 if(req.user) {
   //store the users _id in viewCount
   var user = req.user._id;
   var slug = req.params.slug;
   var categorySlug = req.params.categorySlug
   var dateSlug = req.params.dateSlug;
   var userID = {'uid':user}

  MainArticle.findOneAndUpdate({'slug' : slug}, { $addToSet: {'viewCount': userID}}, {  upsert: true, new: true, setDefaultsOnInsert: true}, function(err, articleWithID){
    if(err) {
      console.log(err,'failed');
    } else {
      console.log('articles.js req.user', 'successful');
    }
  });
 } else {

  // if there is no currentUser, store browser cookie in viewCount for viewers who do not have an account
  var slug = req.params.slug;
  var viewedID = {'uid':req.cookies.cookieName}
  MainArticle.findOneAndUpdate({'slug' : slug}, { $addToSet: {'viewCount': viewedID}}, {  upsert: true, new: true, setDefaultsOnInsert: true}, function(err, articleWithID){
    if(err) {
      console.log(err,'failed');
    } else {
      console.log('articles.js notLoggedIn','successful');
    }
  });
 }
});


//DELETE POST FROM DATABASE
router.delete('/article/:categorySlug/:slug', middleware.checkOwnership, function (req, res) {
  var slug = req.params.slug
  MainArticle.findOneAndRemove({'slug' : slug}, function (err) {
      if (err) {
        req.flash('error', 'Cannot Delete Article')
        throw(err);
      } else {
        req.flash('success', 'Article Successfully Deleted')
        res.redirect('/');
      }
    });
});

router.get('/', function (req, res) {

// var limit = req.limit.query || 5;
var result = MainArticle;
var article = MainArticle;

article.find({ priority: ['Breaking News'] })
.sort({date: -1})
.limit(1)
.exec(function(err, breakingNews) {
  if (err || !breakingNews) {
    console.log(err);
    req.flash('Troubleshooting Error')
    redirect('/');
  } else {
    // console.log(breakingNews);
    // if(breakingNews && Date.now() > breakingNews.createdAt + 86400000  ) {
    //   var priority = {slug: 'slug', priority: 'Breaking News'}
    //   var newPriority = '';
    //   article.findOneAndUpdate(priority, newPriority,function(err, BreakingNews){
    //     if(err) {
    //       console.log(err);
    //     } else {
    //       console.log('Successfully updated priority');
    //     }
    //   });
    // }
    // If article with breaking news is > 1-2 days old, findOneAndUpdate priority to none.
    // var priority = 'Breaking News'
    result.breakingNews = breakingNews;
  };
});

article.find({ priority: ['Top Headlines'] })
.sort({date: -1})
.limit(7)
.exec(function(err, topHeadlines) {
  if (err || !topHeadlines) {
    console.log(err);
    req.flash('Troubleshooting Error')
    redirect('/');
  } else {
    result.topHeadlines = topHeadlines;
  };
});

article.find({ category: ['U.S. News'], priority: '' })
.sort({date: -1})
.limit(4)
.exec(function(err, usNews) {
  if (err || !usNews) {
    console.log(err);
    req.flash('Troubleshooting Error')
    redirect('/');
  } else {
    result.usNews = usNews;
  };
});

article.find({ category: ['Worldwide'], priority: '' })
.sort({date: -1})
.limit(4)
.exec(function(err, worldwide) {
  if (err || !worldwide) {
    console.log(err);
    req.flash('Troubleshooting Error')
    redirect('/');
  } else {
    result.worldwide = worldwide;
  };
});

article.find({ category: ['Business'], priority: '' })
.sort({date: -1})
.limit(4)
.exec(function(err, business) {
  if (err) {
    console.log(err || !business);
    req.flash('Troubleshooting Error')
    redirect('/');
  } else {
    result.business = business;
  };
});

article.find({ category: ['Tech'], priority: '' })
.sort({date: -1})
.limit(4)
.exec(function(err, tech) {
  if (err || !tech) {
    console.log(err);
    req.flash('Troubleshooting Error')
    redirect('/');
  } else {
    result.tech = tech;
  };
});

article.find({ category: ['Markets'], priority: '' })
.sort({date: -1})
.limit(4)
.exec(function(err, markets) {
  if (err || !markets) {
    console.log(err);
    req.flash('Troubleshooting Error')
    redirect('/');
  } else {
    result.markets = markets;
  };
});

article.find({ category: ['Travel'], priority: '' })
.sort({date: -1})
.limit(4)
.exec(function(err, travel) {
  if (err || !travel) {
    console.log(err);
    req.flash('Troubleshooting Error')
    redirect('/');
  } else {
    result.travel = travel;
  };
});

article.find({ category: ['Sports'], priority: '' })
.sort({date: -1})
.limit(4)
.exec(function(err, sports) {
  if (err || !sports) {
    console.log(err);
    req.flash('Troubleshooting Error')
    redirect('/');
  } else {
    result.sports = sports;
  };
});

article.find({ category: ['Economics'], priority: '' })
.sort({date: -1})
.limit(4)
.exec(function(err, economics) {
  if (err || !economics) {
    console.log(err);
    req.flash('Troubleshooting Error')
    redirect('/');
  } else {
    result.economics = economics;
    // console.log(req.cookies);
    // console.log(req.session);
  };
});

article.find({ category: ['Lifestyle'], priority: '' })
.sort({date: -1})
.limit(4)
.exec(function(err, lifestyle) {
  if (err || !lifestyle) {
    console.log(err);
    req.flash('Troubleshooting Error')
    redirect('/');
  } else {
    result.lifestyle = lifestyle;
    res.render('landing', {result});
    // console.log(req.cookies);
    // console.log(req.session);
  };
});


});


function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get('/profile/user/:user', middleware.isProfile,  function (req, res) {
    User.findById(req.params.user, function (err, foundUser) {
      if (err) {
        console.log(err);
      }
      res.render('profile', { user: foundUser });
    });
  });

//  MULTER

var fileFilter = (req, file, cb) => {
  //reject file
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null,true);
  } else {
  cb(null, false);
  }
};
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/profilePhoto/');
    // '/uploads/new Date()/'
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  }
});

var upload = multer({
  storage: storage,
  fileFilter: fileFilter
});  

// Edit User Info 
router.put('/profile/user/:user', upload.single('profilePhoto'), function(req, res) {
  var photo = req.file.path;
User.findOneAndUpdate( {_id: req.params.user}, {$set:{profilePhoto: photo}}, {new: true}, function(err, updatedUser){
    if(!updatedUser) {
      console.log(err, 'error, user not updated');
    } else {
      // var updateAllPosts = {'author.photo': updatedUser.profilePhoto}
      MainArticle.update({"author.id": updatedUser._id}, {$set: {"author.photo": updatedUser.profilePhoto}}, {multi: true}, function(err, updatedAllArticles){
        if(err) {
          console.log(err, 'Could not updated all articles')
        } else {
          console.log(updatedAllArticles, 'successfully updated author photos on all authors articles ')
        }
      });
      console.log('user successfully updated everything');
      res.redirect('/profile/user/' + req.params.user)
    }
  })
});  

// FInd all articles where author id = user_id and updated the profilePhoto:photo.

function limit() {
  var limit = req.query.limit || 10;
}

router.get('/removecookie', function (req, res){
  res.clearCookie("uid=7b84b5c0-1e72-11e8-870d-2bc64c93f3c1");
  res.send('clearing cookie');
});

module.exports = router;
