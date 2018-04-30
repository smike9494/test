var express        = require('express');
var router         = express.Router();
var User           = require('../models/user');
var middleware     = require('../middleware');
const fs           = require('fs');
const path         = require('path');
var multer         = require('multer');
var async          = require('async');
var nodemailer     = require('nodemailer');
var crypto         = require('crypto');
// var uid            = require('uuid/v1');

router.get('/access/control', middleware.rbacPermissions, function(req, res) {
    res.render('./RBAC/rbac');
  });
  
  router.get('/access/control/superadmin', middleware.rbacPermissions, function(req, res){
    res.render('rbacSuperAdmin');
  });

  router.post('/access/control/superadmin', function(req, res){ 
    var randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    User.findOne({ email: req.body.emailSuperAdmin }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists or was found.');
          return res.redirect('/access/control/superadmin');
        } else {
            if(user && !user.userRef) {
                User.findOneAndUpdate({_id: user.id},{$set:{permission: 'SuperAdmin', userRef: randomNumber}}, {new: true}, function(err, updatedUser){
                    if(err) {
                        console.log(err);
                    } else {
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                   user: 'vipodaza@gmail.com',
                                   pass: 'letmein123yt'
                               }
                           });

                        var mailOptions = {
                            from: 'vipodaza@gmail.com', // sender address
                            to: updatedUser.email, // list of receivers
                            subject: 'VIPODAZA Permissions Updated', // Subject line
                            html: '<p>Your access control permissions have been updated and a user reference number has been added. Your permissions status has been updated to "SuperAdmin".</p>'// plain text body
                          };
                          
                         transporter.sendMail(mailOptions, function (err, info) {
                            if(err)
                              console.log(err)
                            else
                              console.log(info);
                         });
                        req.flash('success', 'An e-mail has been sent to ' + updatedUser.email + ' with further instructions.');
                        res.redirect('back');
                    }
                });
            } if (user && user.userRef) {
                User.findOneAndUpdate({_id: user.id},{$set:{permission: 'SuperAdmin'}}, function(err, updatedRoles){
                    if(err) {
                        console.log(err)
                    } else {
                        console.log('updated the users permission to moderator, did not add userRef#')
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                   user: 'vipodaza@gmail.com',
                                   pass: 'letmein123yt'
                               }
                           });

                        var mailOptions = {
                            from: 'vipodaza@gmail.com', // sender address
                            to: updatedRoles.email, // list of receivers
                            subject: 'VIPODAZA Permissions Updated', // Subject line
                            html: '<p>Your access control permissions have been updated. Your permissions settings have been updated to "SuperAdmin".</p>'// plain text body
                          };
                          
                         transporter.sendMail(mailOptions, function (err, info) {
                            if(err)
                              console.log(err)
                            else
                              console.log(info);
                         });
                         req.flash('success', 'An e-mail has been sent to ' + updatedRoles.email + ' with further instructions.');
                         res.redirect('back');
                    }
                });
            }
        }  
  });
}); 
  
  router.get('/access/control/admin', middleware.rbacPermissions, function(req, res){
    res.render('rbacAdmin');
  });

  router.post('/access/control/admin', function(req, res){ 
    var randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    User.findOne({ email: req.body.emailAdmin }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists or was found.');
          return res.redirect('/access/control/admin');
        } else {
            if(user && !user.userRef) {
                User.findOneAndUpdate({_id: user.id},{$set:{permission: 'Admin', userRef: randomNumber}}, {new: true}, function(err, updatedUser){
                    if(err) {
                        console.log(err);
                    } else {
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                   user: 'vipodaza@gmail.com',
                                   pass: 'letmein123yt'
                               }
                           });

                        var mailOptions = {
                            from: 'vipodaza@gmail.com', // sender address
                            to: updatedUser.email, // list of receivers
                            subject: 'VIPODAZA Permissions Updated', // Subject line
                            html: '<p>Your access control permissions have been updated and a user reference number has been added. Your permissions status has been updated to "Admin".</p>'// plain text body
                          };
                          
                         transporter.sendMail(mailOptions, function (err, info) {
                            if(err)
                              console.log(err)
                            else
                              console.log(info);
                         });
                        req.flash('success', 'An e-mail has been sent to ' + updatedUser.email + ' with further instructions.');
                        res.redirect('back');
                    }
                });
            } if (user && user.userRef) {
                User.findOneAndUpdate({_id: user.id},{$set:{permission: 'Admin'}}, function(err, updatedRoles){
                    if(err) {
                        console.log(err)
                    } else {
                        console.log('updated the users permission to moderator, did not add userRef#')
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                   user: 'vipodaza@gmail.com',
                                   pass: 'letmein123yt'
                               }
                           });

                        var mailOptions = {
                            from: 'vipodaza@gmail.com', // sender address
                            to: updatedRoles.email, // list of receivers
                            subject: 'VIPODAZA Permissions Updated', // Subject line
                            html: '<p>Your access control permissions have been updated. Your permissions settings have been updated to "Admin".</p>'// plain text body
                          };
                          
                         transporter.sendMail(mailOptions, function (err, info) {
                            if(err)
                              console.log(err)
                            else
                              console.log(info);
                         });
                         req.flash('success', 'An e-mail has been sent to ' + updatedRoles.email + ' with further instructions.');
                         res.redirect('back');
                    }
                });
            }
        }  
  });
}); 
  

router.get('/access/control/moderator', middleware.rbacPermissions, function(req, res){
    res.render('rbacModerator');
});

router.post('/access/control/moderator', function(req, res){ 
    var randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    User.findOne({ email: req.body.emailModerator }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists or was found.');
          return res.redirect('/access/control/moderator');
        } else {
            if(user && !user.userRef) {
                User.findOneAndUpdate({_id: user.id},{$set:{permission: 'Author', userRef: randomNumber}}, {new: true}, function(err, updatedUser){
                    if(err) {
                        console.log(err);
                    } else { 
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                   user: 'vipodaza@gmail.com',
                                   pass: 'letmein123yt'
                               }
                           });

                        var mailOptions = {
                            from: 'vipodaza@gmail.com', // sender address
                            to: updatedUser.email, // list of receivers
                            subject: 'VIPODAZA Permissions Updated', // Subject line
                            html: '<p>Your access control permissions have been updated and a user reference number has been added. Your permissions status has been updated to "Moderator/Author".</p>'// plain text body
                          };
                          
                         transporter.sendMail(mailOptions, function (err, info) {
                            if(err)
                              console.log(err)
                            else
                              console.log(info);
                         });
                        req.flash('success', 'An e-mail has been sent to ' + updatedUser.email + ' with further instructions.');
                        res.redirect('back');
                    }
                });
            } if (user && user.userRef) {
                User.findOneAndUpdate({_id: user.id},{$set:{permission: 'Author'}}, function(err, updatedRoles){
                    if(err) {
                        console.log(err)
                    } else {
                        console.log('updated the users permission to Author, did not add userRef#')
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                   user: 'vipodaza@gmail.com',
                                   pass: 'letmein123yt'
                               }
                           });

                        var mailOptions = {
                            from: 'vipodaza@gmail.com', // sender address
                            to: updatedRoles.email, // list of receivers
                            subject: 'VIPODAZA Permissions Updated', // Subject line
                            html: '<p>Your access control permissions have been updated. Your permissions settings have been updated to "Moderator/Author".</p>'// plain text body
                          };
                          
                         transporter.sendMail(mailOptions, function (err, info) {
                            if(err)
                              console.log(err)
                            else
                              console.log(info);
                         });
                         req.flash('success', 'An e-mail has been sent to ' + updatedRoles.email + ' with further instructions.');
                         res.redirect('back');
                    }
                });
            }
        }  
  });
}); 
  
  

module.exports = router;