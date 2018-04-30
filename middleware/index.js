var MainArticle = require('../models/article');
var Comment = require('../models/comment');
var User = require('../models/user');

var middlewareObj = {};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, function (err, foundComment) {
          if (err) {
            res.redirect('back');
          } else {
            //Does comment belong to user?
            if (foundComment.author.id.equals(req.user._id) || req.user.permission == 'SuperAdmin' || req.user.permission === 'Admin' || req.user.permission === 'Author') {
              next();
            } else {
              res.redirect('back');
            }
          }
        });
    } else {
      res.redirect('back');
    }
  };

middlewareObj.checkOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
      var slug = req.params.slug;
      MainArticle.findOne({'slug' : slug}, function (err, foundMainArticle) {
          if (err || !foundMainArticle) {
            console.log(err);
            req.flash('error', 'Could not locate page')
            res.redirect('back');
          } else {
            //Does article belong to user?
            if (foundMainArticle.author.id.equals(req.user._id) || req.user.permission === 'SuperAdmin' || req.user.permission === 'Admin') {
              next();
            } else {
              res.redirect('back');
            }
          }
        });
    } else {
      // res.redirect('/article/' + req.params.categorySlug + '/' + req.params.slug);
      res.render('articles/errorPage');
    }
  };

middlewareObj.isLoggedIn = function (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      // req.flash('error', 'You Must Be Logged In To Do That.')
      res.render('articles/errorPage');
    };

middlewareObj.isNotLoggedIn = function(req, res, next) {
  if(!req.isAuthenticated()) {
    res.redirect('/');
  }
} ;   

middlewareObj.isComment = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You Must Be Logged In To Do That.')
  res.redirect('/login')
};

middlewareObj.isProfile = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // req.flash('error', 'You Must Be Logged In To Do That.')
  // res.render('articles/errorPage');
  res.redirect('/login');
};    

middlewareObj.isNotAuthenticated = function (req, res, next) {
  if(req.isAuthenticated()) {
    req.flash('error',);
    res.redirect('/');
  } else {
    return next();
  }
}    

// Check if slug exists, if not redirect to previous slug
middlewareObj.foundArticle = function(req, res, next) {
  var slug = req.params.slug;
  var dateSlug = req.params.dateSlug;
  MainArticle.findOne({'slug' : slug }).populate('comments').exec(function (err, foundMainArticle) {
    if(err || !foundMainArticle) {
      console.log(err)
      res.render('articles/errorPage');
    } else {
      res.render('articles/show', { mainArticles: foundMainArticle, title: foundMainArticle.title, pageViewCount: req.session.views});
      next();
    }
  });
}

middlewareObj.updateHeadlines = function(req, res, next) {
  var priority = {priority: 'Breaking News'}
  var newPriority = '';
  MainArticle.findOne({priority:'Breaking News'}, function(err, foundArticle){
    if(err){
      console.log(err)
    } else {
      if( foundArticle && Date.now() > foundArticle.createdAt + 2  ) {
        MainArticle.findOneAndUpdate(priority, newPriority).exec(function(err, updatedBreakingNews){
          if(err) {
            console.log(err);
          } else {
            console.log('Successfully updated priority')
            next();
          }
        });
      }
     } 
  });
}

middlewareObj.rbacPermissions = function(req, res, next) {
  if (req.isAuthenticated()) {
    User.findOne({_id : req.user.id}, function(err, user){
      if(err) {
        console.log('failed', err)
      } else {
        console.log('found user', user);
        if(user && user.permission === 'SuperAdmin' ||  user.permission === 'Admin') {
          return next();
        } else {
          if (user && user.permission === 'user') {
            res.render('articles/errorPage');
          }
        }
      } 
    });
    // return next();
  } else {
    res.render('articles/errorPage')
  }
}

middlewareObj.rbacPostPermissions = function(req, res, next) {
  if (req.isAuthenticated()) {
    User.findOne({_id : req.user.id}, function(err, user){
      if(err) {
        console.log('failed', err)
      } else {
        console.log('found user', user);
        if(user && user.permission === 'SuperAdmin' ||  user.permission === 'Admin' || user.permission === 'Author') {
          return next();
        } else {
          if (user && user.permission === 'user') {
            res.render('articles/errorPage');
          }
        }
      } 
    });
    // return next();
  } else {
    res.render('articles/errorPage')
  }
}










// const isNotAuthenticated = (req, res, next) => {
//   if(req.isAuthenticated()) {
//     req.flash('error', 'Sorry, But You Must Be Registered First');
//     res.redirect('/');
//   } else {
//     return next();
//   }
// }

module.exports = middlewareObj;
