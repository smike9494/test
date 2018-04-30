var express        = require('express');
var router         = express.Router();
var MainArticle    = require('../models/article');
var Comment        = require('../models/comment');
var User           = require('../models/user');
var middleware     = require('../middleware');

//================COMMENTS====================
//CREATE COMMENTS

router.post('/article/:id/comments', middleware.isComment, function (req, res) {
      MainArticle.findById(req.params.id, function (err, article) {
        if (err) {
          console.log(err);
        } else {
          Comment.create(req.body.comment, function (err, comment) {
              console.log(req.body.comment);
              if (err) {
                req.flash('error', 'Unable to post comment')
                console.log(err);
              } else {
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                article.comments.push(comment);
                article.save();
                // req.flash('success', 'Comment successfully posted!')
                // res.redirect('/article/' + req.params.categorySlug + '/' + req.params.slug);
                res.redirect('back');
              }
            });
        }
      });
    });

//EDIT COMMENTS
router.get('/article/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        req.flash('error', 'Unable to locate comment')
        res.redirect('back');
      } else {
        req.flash('succes', 'Successfully located comment')
        res.render('./comments/edit', { mainArticles_id: req.params.id, comment: foundComment });
      }
    });
  });

//UPDATE COMMENT
router.put('/article/:id/comments/:comment_id', middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
      if (err) {
        console.log(err);
        req.flash('error', 'Unable to update comment')
        res.redirect('back');
      } else {
        req.flash('success', 'Successfully updated comment')
        res.redirect('/article/' + req.params.categorySlug + '/' + req.params.slug);
        // res.redirect('back');
      }
    });
});

//Delete Comment
router.delete('/article/:id/comments/:comment_id', middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
      console.log(req.params.comment_id);
      if (err) {
        console.log(err);
        req.flash('error', 'Unable to locate comment')
        res.redirect('back');
      } else {
        // req.flash('success', 'Successfully deleted comment')
        // res.redirect('/article/' + req.params.categorySlug + '/' + req.params.slug);
        res.redirect('back');
      }
    });
  });

module.exports = router;
